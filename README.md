# 仙術杯 JP Archive

中国《明日方舟》集成战略社区赛事“仙术杯”的日语资料站。目前收录第 3—8 届的公开参赛记录，并提供届次筛选、全文搜索、选手聚合与比赛录像入口。

## 当前数据

- 138 条公开参赛记录
- 68 个不同选手名
- 6 届赛事（第 3—8 届）
- 50 个公开比赛日
- 选手、队伍、分队中日文名、初手干员、达成结局与得分

所有比赛录像链接目前均标记为“待人工确认”。不同届次的得分规则可能不同，不建议直接跨届比较。

## 本地开发

```bash
npm ci
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。

提交前运行：

```bash
npm run lint
npm run build
```

## 更新选手名册

微信分享版名册是一个把数据和头像都嵌入其中的 HTML 文件。仓库内的导入脚本会提取 `DATA` 数组、去重头像、转换为 WebP，并更新网站使用的 JSON：

```bash
python scripts/import_roster.py path/to/仙术杯选手档案.html --download-remote
```

输出位置：

- `app/data/players.json`：结构化参赛记录
- `public/avatars/`：去重并压缩后的本地头像

## 项目结构

```text
app/
  archive/          # 搜索、筛选、参赛记录与选手视图
  components/       # 全站页头与页脚
  data/             # 名册数据、届次资料与类型
  page.tsx          # 第 3—8 届总览首页
public/
  avatars/          # 本地选手头像
  images/           # 各主题视觉图
scripts/
  import_roster.py  # 离线名册导入工具
```

## 资料与版权说明

本项目是非官方粉丝资料站。赛事信息来自公开大会页面、公开录像与社区资料，页面会尽可能保留来源入口和验证状态。游戏名称、角色与相关素材的权利归其各自权利人所有。
