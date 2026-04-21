# webmc

**Web-native reimplementation of Minecraft Java Edition — built for the browser, optimized for the network.**

`webmc` 是一个由 AI 驱动的实验性项目,目标是将 Minecraft Java 版的完整逻辑在 Web 3D 引擎之上**从零重写**,并针对现代浏览器与多人网络环境进行深度优化。

## 目标

- **点开即玩**:无需客户端安装、无需 Java 运行时,打开链接即可进入世界。
- **高性能**:利用 WebGPU / WebGL2、SIMD、Web Workers、流式区块加载等现代 Web 技术,将移动端与低配设备也纳入可玩范围。
- **原生联机**:基于 WebRTC / WebSocket 的权威服务器架构,延迟、同步、反作弊全部重构,而非简单移植 Java 版的网络协议。
- **AI-first 开发**:整个代码库由 AI 按模块化规范生成、审查、迭代,强调可读性与一致性,便于长期演进。

## 范围

本项目**不是**第三方启动器、不是 Mod 加载器、不是 Minecraft 客户端的封装。所有逻辑(方块、物理、光照、生成、实体 AI、红石、网络协议……)均为**全新独立实现**,不包含任何 Mojang/Microsoft 的专有代码、资源或受版权保护的素材。

玩家需自行提供合法的原版资源(材质、声音等)方可获得完整体验,或使用项目提供的替代素材。

## 状态

🚧 **早期开发阶段** — 架构设计与核心引擎搭建中,尚不可玩。

## 许可证

本项目采用 [GNU Affero General Public License v3.0](./LICENSE)。

这意味着:**任何基于本项目运行的在线服务(包括私服、托管版本、衍生网游),都必须向其用户公开完整的修改后源代码。** 闭源商用、SaaS 形式再发布均不被允许。

## 免责声明

Minecraft 是 Mojang Studios / Microsoft 的注册商标。本项目与 Mojang、Microsoft 无任何关联,亦未获得其授权或背书。
