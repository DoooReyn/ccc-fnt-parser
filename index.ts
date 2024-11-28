import fs from "fs";
import { FntParser } from "./fnt-parser";

/**
 * Cocos Creator 专供 Fnt -> JSON 转换器
 * @warn 不支持多 page，所以请不要用多 page 的 fnt 文件
 * @example 用法
 * - `bun run index,ts fightNumber`
 * - `bun run index.ts fightNumber.fnt fightNumber.json`
 */
(function main() {
    // 处理输入参数
    let input = process.argv[2];
    let output = process.argv[3];
    if (!input.endsWith(".fnt")) {
        input += ".fnt";
    }
    if (!fs.existsSync(input)) {
        console.error("输入文件不存在:" + input);
        process.exit(-1);
    }
    if (!output) {
        output = input.replace(".fnt", ".json");
    }
    if (!output.endsWith(".json")) {
        output += ".json";
    }
    console.log("输入文件:", input);
    console.log("输出文件:", output);

    // 解析与转换
    var char;
    const parser = FntParser.parse(input);
    const json = parser.toJSON();
    const cccFnt: Record<string, any> = {
        commonHeight: json.common.lineHeight,
        fontSize: json.info.size,
        atlasName: json.page.file,
        fontDefDictionary: {},
        kerningDict: {},
    };
    for (const idx in json.char) {
        char = json.char[idx];
        cccFnt.fontDefDictionary[char.id] = {
            rect: {
                x: char.x,
                y: char.y,
                width: char.width,
                height: char.height,
            },
            xOffset: char.xoffset,
            yOffset: char.yoffset,
            xAdvance: char.xadvance,
        };
    }

    // 输出文件
    const content = JSON.stringify(cccFnt, null, 0);
    fs.writeFileSync(output, content, { encoding: "utf-8" });
})();
