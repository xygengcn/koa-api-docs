import RouteDoc from './route.doc';
import { ApiRoutesTree } from '@xygengcn/koa-api';
import { DocOptions } from './index';
export class ControllerDoc {
    /**
     * 接口对象
     */
    private controller: ApiRoutesTree;

    /**
     * 配置
     */
    private docOptions!: DocOptions;

    constructor(controller: ApiRoutesTree, options: DocOptions) {
        this.controller = controller;
        this.docOptions = options;
    }

    /**
     * 接口标题
     */
    private get title(): { h2: string } {
        return {
            h2: this.controller.attributes?.name || ''
        };
    }

    /**
     * 接口描述
     */
    private get description(): { blockquote: string } {
        return {
            blockquote: this.controller.attributes?.description || ''
        };
    }

    /**
     * 具体接口文档
     */
    private get childDoc() {
        const routes = this.controller?.routes;
        let childDocs: Array<Object> = [];
        routes.forEach((route) => {
            const methodControllerDoc = new RouteDoc(route, this.docOptions);
            childDocs = childDocs.concat(...methodControllerDoc.toJSON());
        });
        return childDocs;
    }

    /**
     * 调出每一个接口的文档
     * @returns
     */
    public toJSON(): Array<Object> {
        return [this.title, this.description, ...this.childDoc];
    }
}
