# ccc-fnt-parser

FNT 字体配置通用解析器（提供 Cocos Creator 专供解析器）

> 做这个解析器一开始是为了在 Cocos Creator 中能够不依赖于 **Bundle** 进行远程加载 **BitmapFont** 资源，
> 然而动态创建 **BitmapFont** 需要提供字体配置信息，而这个配置信息只有拖入 `.fnt` 文件到编辑器中才会生成（`.meta`）。
> 因此，需要一个外部解析器来生成这份配置，**ccc-fnt-parser** 就由此诞生。
> 后来发现完全可以弄一个通用的解析器，因此稍微改改就开源了。

## 用途

-   提供一个通用的 FNT 字体配置解析器，用于解析 FNT 字体配置文件，供使用者获取自定义的转换结果
-   提供一个 Cocos Creator 专供的解析器，输出 Cocos Creator 专供的 JSON 解析结果

## 使用方法

-   可以单独引入 `fnt-parser.ts` 文件或修改 `index.ts` 中的 `main` 方法，以获取自定义的转换结果
-   也可以运行 `bun run index.ts path/to/fnt path/to/json` 直接获取 Cocos Creator 专供的解析结果
