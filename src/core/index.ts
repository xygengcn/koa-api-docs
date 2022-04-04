import { ControllerDoc } from './controller.doc';
import { ApiRoutesTree, ApiRunOptions } from '@xygengcn/koa-api';
import { createWriteStream, createReadStream, existsSync, mkdirSync, readdirSync } from 'fs';
import json2md from 'json2md';
import { join } from 'path';

export interface DocOptions {
    path: string;
    docsify?: boolean;
    host?: string;
}

/**
 * 文件夹复制
 * @param from
 * @param to
 */
function copyDir(to: string) {
    const docsifyPath = join(__dirname, process.env.APP === 'development' ? '../docsify' : './docsify');
    const files = readdirSync(docsifyPath);
    files.forEach((file) => {
        const fromFile = join(docsifyPath, file);
        const toFile = join(to, file);
        createReadStream(fromFile).pipe(createWriteStream(toFile));
    });
}

/**
 * 写入文件
 * @param data
 * @param path
 */
function writeDoc(data: Array<any>, path: string) {
    const write = createWriteStream(join(path, 'README.md'));
    write.write(json2md(data));
}

/**
 * 展开树形结构
 * @param tree
 */
function flattenController(tree: ApiRoutesTree): Array<ApiRoutesTree> {
    let cotrollers: Array<ApiRoutesTree> = [];
    if (!tree.anonymous) {
        cotrollers.push(tree);
    }
    if (tree.childRoutesTree) {
        tree.childRoutesTree.forEach((child) => {
            cotrollers = cotrollers.concat(flattenController(child));
        });
    }
    return cotrollers;
}

/**
 * 自动生成readme
 * @param param0
 */
function Doc(options: DocOptions) {
    const { path, docsify } = options;
    if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }
    return ({ routeTree }: ApiRunOptions) => {
        if (routeTree) {
            const controllers = flattenController(routeTree);
            const controllersDocs = controllers.reduce((arr: Array<any>, controller) => {
                const controllerDoc = new ControllerDoc(controller, options);
                arr = arr.concat(controllerDoc.toJSON());
                return arr;
            }, []);
            writeDoc(controllersDocs, path);
            if (docsify) {
                copyDir(path);
            }
        }
    };
}
export default Doc;
