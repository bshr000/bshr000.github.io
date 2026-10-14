# About 内容维护

- `lib/about.ts`：个人信息、照片、教育经历。教育日期来自本人确认；重复荣誉名称在页面只显示一次，原始数据保留。
- `lib/about-skills.ts`：技能与工具分组，不使用未经确认的熟练度评级。
- `components/about/PhotoGallery.tsx`：当前一张真实个人照，点击可放大；增加照片后自动显示缩略图、前后切换与数量。手机缩略图支持横向滑动，无自动播放。
- 照片结构：`id / src / alt / caption / objectPosition`。修改焦点位置可避免裁切人物。
- 简历使用 `public/resume/xuyang-zhao-resume.pdf`；文件存在时显示预览和下载。

## 山景背景

`public/images/about/mountains.png` 通过内置 imagegen 按用户参考图编辑生成。背景不含文字；标题与诗句均使用 HTML。

参考：codex-clipboard-883cb877-b41d-4b8f-9415-d5d3c9908c5b.png

提示词：Edit this reference into a clean photographic panoramic mountain website banner BACKGROUND ONLY. Remove absolutely all typography, letters, numbers, quote, lines, blue cross symbols. Preserve the reference's beautiful central jagged blue mountain peak, drifting white mist, pale blue sky and gentle warm sunrise light. Wide panoramic 4:1 composition. Leave generous pale sky and mist on left and right for real HTML text added later. Natural, crisp mountain photography, restrained low contrast around edges. No text, no logos, no decorative graphics.
