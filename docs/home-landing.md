# 首页：云海入口

首页采用单屏山景、BadMo 透明形象、真实 HTML 标题与四个栏目入口。保留共用导航、页脚、音乐和浮动宠物。原首页不再展示内容列表，所有栏目与内容数据仍保留。

本地素材：
- public/images/home/cloud-sea.png
- public/images/home/badmo-portrait.png

两张素材使用内置 imagegen 生成，以用户上传的参考图为编辑目标，没有调用 CLI 或外部 API。保留生成原件，项目采用独立副本。背景为生成场景，不表示用户真实旅行照片。首页刻意保持参考图中的明亮日出配色；系统深色模式继续作用于共用导航、页脚及其余页面。

## 背景提示词

Edit target: attached homepage reference. Make a clean photographic background asset only. Remove ALL text, Chinese and English, all separator lines, and the cartoon black cat near the upper center. Seamlessly restore sky in these areas. Preserve the entire original scenic composition: soft blue and peach sunrise sky upper 55%, distant layered mountains and sea of clouds, sun at right, seated backpacker facing away on the rocky lower-left foreground. Keep person and mountain position and photographic quality. Landscape 16:9. No lettering, no logos, no cat, no interface. This will be a full-bleed website background with live HTML overlay.

## BadMo 提示词

Extract ONLY the small illustrated BadMo fox-cat beside the Chinese heading in this reference, as a standalone clean transparent PNG. Preserve its exact character design and expression: charcoal black fluffy fox-cat, large pale inner ears, green eyes, gently tilted head, red scarf, upper chest and small fluffy tail at the right. Same delicate hand-painted anime illustration, facing the viewer. Crop tightly around the character with a little transparent breathing room, entire ears visible. Remove ALL background, Chinese text, English text, lines, symbols and scenery. No white backdrop, actual alpha transparency. No additional text or objects.
