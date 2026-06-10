"""
glitch_cube.py — 双手控制的 3D 故障立方体（TouchDesigner Python DAT 参考脚本）

用途：
    读取 MediaPipe 插件输出的双手 21 关键点，映射到一个立方体的
    位置 / 旋转 / 缩放 / 噪声 / 颜色 / 故障闪烁 / 冻结。

注意：
    - 这是一份「参考实现 / 模板」，由 AI 生成，未在真实工程里跑过。
    - 你需要按自己工程里的实际节点名修改下面 CONFIG 区的 op 路径。
    - 在 TouchDesigner 里把本文件粘进一个 Python DAT，并把 MediaPipe
      的输出（landmarks CHOP/DAT）接到该 DAT 的输入。
    - 典型做法：用一个 CHOP Execute DAT 或 Execute DAT 在每帧调用 update()。

MediaPipe 手部 21 点索引参考：
    0=手腕  4=拇指尖  8=食指尖  12=中指尖  16=无名指尖  20=小指尖
"""

import math

# =========================================================
# CONFIG —— 所有可调参数集中在这里，按需修改
# =========================================================

# --- 工程里的目标算子路径（请改成你自己的节点名）---
CUBE_GEO        = 'geo1'          # 立方体所在的 Geometry COMP
CUBE_TRANSFORM  = 'geo1'          # 控制位移/旋转/缩放的 COMP（通常同上）
NOISE_TOP       = 'noise1'        # 控制 glitch 噪声强度的 TOP
COLOR_CONST     = 'constant1'     # 控制颜色的 Constant TOP/MAT
HANDS_CHOP      = 'mediapipe_hands'  # MediaPipe 输出的手部关键点 CHOP

# --- 灵敏度 / 范围 ---
MOVE_RANGE      = 5.0    # 平移幅度（世界单位）
ROT_RANGE       = 180.0  # 旋转幅度（度）
SCALE_MIN       = 0.3    # 最小缩放
SCALE_MAX       = 3.0    # 最大缩放
DIST_MIN        = 0.05   # 双手最近归一化距离（贴近）
DIST_MAX        = 0.9    # 双手最远归一化距离（张开）

PINCH_THRESHOLD = 0.05   # 捏合判定：拇指尖与食指尖距离阈值
FIST_THRESHOLD  = 0.10   # 握拳判定：指尖到手腕的平均距离阈值
FAST_MOVE_THRESH= 0.08   # 快速移动判定：两帧间中点位移阈值

NOISE_MAX       = 1.0    # 左手捏合时噪声最大强度
GLITCH_FLASH    = 1.0    # 快速移动触发的故障闪烁强度

COLORS = [              # 右手捏合循环切换的颜色列表 (r, g, b)
    (1.0, 0.2, 0.2),
    (0.2, 1.0, 0.4),
    (0.2, 0.5, 1.0),
    (1.0, 1.0, 0.2),
    (1.0, 0.2, 1.0),
]

# =========================================================
# 内部状态（跨帧记忆）
# =========================================================
_state = {
    'color_index': 0,
    'prev_mid': None,       # 上一帧双手中点
    'frozen': False,        # 是否冻结
    'left_pinch_prev': False,
    'right_pinch_prev': False,
}


# =========================================================
# 工具函数
# =========================================================
def _lm(hand, idx):
    """取某只手第 idx 个关键点的 (x, y, z)。
    请按你的 MediaPipe 输出结构调整取值方式。
    这里假设 HANDS_CHOP 通道命名形如:  hand0:lm8:x / hand0:lm8:y ...
    """
    ch = op(HANDS_CHOP)
    if ch is None:
        return None
    try:
        x = ch[f'hand{hand}:lm{idx}:x'].eval()
        y = ch[f'hand{hand}:lm{idx}:y'].eval()
        z = ch[f'hand{hand}:lm{idx}:z'].eval()
        return (x, y, z)
    except Exception:
        return None


def _dist(a, b):
    return math.sqrt(sum((a[i] - b[i]) ** 2 for i in range(min(len(a), len(b)))))


def _mid(a, b):
    return tuple((a[i] + b[i]) / 2.0 for i in range(3))


def _is_pinch(hand):
    """拇指尖(4)与食指尖(8)距离小于阈值 => 捏合。"""
    thumb = _lm(hand, 4)
    index = _lm(hand, 8)
    if thumb is None or index is None:
        return False
    return _dist(thumb, index) < PINCH_THRESHOLD


def _is_fist(hand):
    """五个指尖到手腕(0)的平均距离很小 => 握拳。"""
    wrist = _lm(hand, 0)
    if wrist is None:
        return False
    tips = [4, 8, 12, 16, 20]
    ds = []
    for t in tips:
        p = _lm(hand, t)
        if p is not None:
            ds.append(_dist(p, wrist))
    if not ds:
        return False
    return (sum(ds) / len(ds)) < FIST_THRESHOLD


def _remap(v, in_min, in_max, out_min, out_max):
    if in_max == in_min:
        return out_min
    t = (v - in_min) / (in_max - in_min)
    t = max(0.0, min(1.0, t))
    return out_min + t * (out_max - out_min)


# =========================================================
# 主更新函数：每帧调用一次
# =========================================================
def update():
    left_wrist = _lm(0, 0)
    right_wrist = _lm(1, 0)

    if left_wrist is None or right_wrist is None:
        return

    # 双拳同时握住 => 冻结画面
    if _is_fist(0) and _is_fist(1):
        _state['frozen'] = True
        return
    else:
        _state['frozen'] = False

    geo = op(CUBE_TRANSFORM)

    # 双手中点 => 平移
    mid = _mid(left_wrist, right_wrist)
    tx = _remap(mid[0], 0.0, 1.0, -MOVE_RANGE, MOVE_RANGE)
    ty = _remap(mid[1], 0.0, 1.0, MOVE_RANGE, -MOVE_RANGE)
    if geo is not None:
        geo.par.tx = tx
        geo.par.ty = ty

    # 双手角度 => 绕 X/Y 旋转
    dx = right_wrist[0] - left_wrist[0]
    dy = right_wrist[1] - left_wrist[1]
    angle = math.degrees(math.atan2(dy, dx))
    if geo is not None:
        geo.par.rx = _remap(angle, -180.0, 180.0, -ROT_RANGE, ROT_RANGE)
        geo.par.ry = _remap(angle, -180.0, 180.0, ROT_RANGE, -ROT_RANGE)

    # 双手距离 => 缩放
    hand_dist = _dist(left_wrist, right_wrist)
    scale = _remap(hand_dist, DIST_MIN, DIST_MAX, SCALE_MIN, SCALE_MAX)
    if geo is not None:
        geo.par.sx = scale
        geo.par.sy = scale
        geo.par.sz = scale

    # 左手捏合 => 增加噪声失真
    noise = op(NOISE_TOP)
    if noise is not None:
        if _is_pinch(0):
            try:
                noise.par.amp = NOISE_MAX
            except Exception:
                pass
        else:
            try:
                noise.par.amp = 0.0
            except Exception:
                pass

    # 右手捏合 => 循环切换颜色（上升沿触发）
    right_pinch = _is_pinch(1)
    if right_pinch and not _state['right_pinch_prev']:
        _state['color_index'] = (_state['color_index'] + 1) % len(COLORS)
        r, g, b = COLORS[_state['color_index']]
        col = op(COLOR_CONST)
        if col is not None:
            try:
                col.par.colorr = r
                col.par.colorg = g
                col.par.colorb = b
            except Exception:
                pass
    _state['right_pinch_prev'] = right_pinch

    # 快速移动 => 触发故障闪烁
    if _state['prev_mid'] is not None:
        move_amt = _dist(mid, _state['prev_mid'])
        if move_amt > FAST_MOVE_THRESH and noise is not None:
            try:
                noise.par.amp = GLITCH_FLASH
            except Exception:
                pass
    _state['prev_mid'] = mid


# 如果用 Execute DAT 的 onFrameStart，可直接调用：
# def onFrameStart(frame):
#     update()
#     return
