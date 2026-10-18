# Multi-Repo Task Router

[English](README.md)

Multi-Repo Task Router 是一个把跨多个仓库的开发请求转换成责任清晰执行地图的智能体 Skill。它保留共同目标，同时整理仓库范围证据、共享契约交接、依赖顺序、每个仓库的独立工作包和跨仓库验收方案。

本 Skill 通过可直接导入的 .ipollowork-plugin 安装包支持 [iPolloWork](https://github.com/Devin-AXIS/iPolloWork)。它是纯声明式资源，不需要账号或外部服务，可在团队通过 GitHub、Slack 或 Microsoft Teams 创建 Issue 和 Pull Request 之前完成任务拆分。

## 适用人群

- 协调多个服务中生产者与消费者修改的平台团队。
- 需要把 Slack 或 Teams 对话整理成仓库级任务的维护者。
- 规划 API、事件、包或 Schema 兼容改动的工程负责人。
- 需要并行处理问题且不能丢失契约依赖的事故响应人员。

## 核心功能

- 区分已观察的仓库归属、合理推断和未知路由。
- 映射生产者与消费者之间的 API、事件、Schema、依赖包、功能开关、版本和运行手册。
- 用明确的串行关口和安全并行分支安排任务顺序。
- 为每个仓库生成包含上下文、边界、输出、验证和完成证据的独立工作包。
- 用协调台账记录 planned、blocked、in-progress 和 verified 状态。
- 将“已创建 Issue 或 PR”和“集成行为已验证”分开记录。

## 完整流程

1. 提供请求或对话、候选仓库、已知负责人、共享接口和部署约束。
2. 明确要求智能体使用 **Multi-Repo Task Router**。
3. 审查仓库范围表以及所有暂定路由。
4. 确认共享契约和依赖图。
5. 将每个仓库的工作包用作 Issue、PR 或代理任务提示。
6. 使用真实链接和已观察的验证结果更新协调台账。

## 输入与输出

最小输入是一条跨仓库请求和候选仓库名。架构图、责任人记录、接口示例、支持的客户端版本、发布顺序和 Issue 规范可以显著提高路由质量。

输出为 Markdown，包含目标、仓库范围表、共享契约台账、依赖图、仓库工作包、集成验证、协调台账和未解决的路由问题。

## 端到端示例

使用 [examples/conversation-request.md](examples/conversation-request.md)，并提出：

> 使用 Multi-Repo Task Router 把这个支付到回执的竞态问题拆分到列出的仓库中，保持旧版移动端兼容并展示依赖顺序。

[examples/expected-task-map.md](examples/expected-task-map.md) 中的预期结果会分别路由事件生产者、订单投影、Web 展示和移动端兼容工作；在移动端支持窗口未知时要求只增加兼容字段；并用共享 Fixture 和契约测试作为联调关口。

## 在 iPolloWork 中安装和使用

安装包已在 macOS 15.5 arm64、iPolloWork 0.50.20、OpenCode 引擎下完成实测。

1. 从 GitHub Release 下载 multi-repo-task-router-1.0.0.ipollowork-plugin。
2. 打开 iPolloWork，进入 **扩展 → 插件 → 添加 → 文件**。
3. 选择安装包，确认预览显示一个 Skill，然后点击 **安装插件**。
4. 打开插件详情，确认 **Multi-Repo Task Router** 已启用；软件提示时重新加载。
5. 在项目任务中粘贴对话和仓库列表，并明确要求使用 Multi-Repo Task Router。
6. 创建外部 Issue 或 PR 前先核对范围表，然后保存或导出 Markdown。

也可以使用本地 Skill 入口：下载 multi-repo-task-router-1.0.0-skill.zip，解压后，在 iPolloWork 的 **导入本地 Skill** 中选择直接包含 SKILL.md 的文件夹。

如果没有发现 Skill，请确认插件已启用、重新加载项目，并检查导入的是安装包而不是源码包。如果某些路由仍为未知，请补充责任人或架构证据，不要猜测。

## 构建与校验

需要 Node.js 20 或更高版本，以及 macOS 或 Linux 的标准 zip 工具。

    npm test
    npm run package
    cd dist && shasum -a 256 -c SHA256SUMS.txt

构建会生成 iPolloWork 安装包、独立 Skill ZIP、源码 ZIP和 SHA-256 校验文件。

## 环境要求与功能限制

- 实测环境：iPolloWork 0.50.20、macOS 15.5 arm64、OpenCode。
- Skill 本身不需要外部运行时、网络权限、Token、Slack 账号、Teams 账号或 GitHub 账号。
- Skill 根据用户提供的证据生成路由产物；除非已有对应工具和授权，否则不会读取私有仓库、创建外部 Issue，也不会验证已部署行为。
- 仓库责任人与支持版本窗口在用户提供或核实之前保持暂定状态。

## 许可证

MIT
