import { ApiRequestMethod, ApiResponseType, IApiRoute } from '@xygengcn/koa-api';
import { DocOptions } from './index';
export default class RouteDoc {
    /**
     * 接口对象
     */
    private methodController: IApiRoute;

    /**
     * 配置
     */
    private docOptions!: DocOptions;

    constructor(methodController: IApiRoute, options: DocOptions) {
        this.methodController = methodController;
        this.docOptions = options;
    }

    /**
     * 接口标题
     */
    private get title(): { h3: string } {
        return {
            h3: this.methodController.name || this.methodController.functionName
        };
    }

    /**
     * 接口描述
     */
    private get description(): { blockquote: string } {
        return {
            blockquote: this.methodController.description || '没有描述'
        };
    }
    /**
     * 接口url
     */
    private get url() {
        return [{ h4: '请求URL' }, { blockquote: `${this.docOptions.host || ''}${this.methodController.url}` }];
    }

    /**
     * 请求方法
     */
    private get method() {
        return [{ h4: '请求方法' }, { blockquote: this.methodController.method.join('、') }];
    }

    /**
     * 跨域范围
     */
    private get origins() {
        return [{ h4: '跨域范围' }, { blockquote: this.methodController?.origin?.join('、') || '默认范围' }];
    }

    /**
     * 返回类型
     */
    private get returnType() {
        if (this.methodController.responseType === ApiResponseType.RESTFUL) {
            return [{ h4: '返回类型' }, { blockquote: 'JSON格式' }];
        }
        if (this.methodController.responseType === ApiResponseType.REDIRECT) {
            return [{ h4: '返回类型' }, { blockquote: '重定向页面' }];
        }
        return [{ h4: '返回类型' }, { blockquote: '默认类型' }];
    }

    /**
     * 请求头部
     */
    private get headers() {
        let rows: Array<any[]> = [['', '', '', '', '']];
        if (this.methodController.request?.headers) {
            rows = Object.entries(this.methodController.request?.headers).map(([key, value]) => {
                const headerOption = value;
                const name: string = key;
                const type: string = this.getType(headerOption?.type);
                const defaultValue: string = String(headerOption?.defaultValue || '');
                const require: string = String(!!headerOption?.require || false);
                const description: string = headerOption?.description || '';
                return [name, type, require, defaultValue, description];
            });
        }
        return [
            { h4: '请求头参数' },
            {
                table: {
                    headers: ['参数名', '参数类型', '是否必须', '默认值', '参数描述'],
                    rows
                }
            }
        ];
    }
    /**
     * url参数
     */
    private get urlQuery() {
        let rows: Array<any[]> = [['', '', '', '', '']];
        if (this.methodController.request?.query) {
            rows = Object.entries(this.methodController.request?.query).map(([key, value]) => {
                const headerOption = value;
                const name: string = key;
                const type: string = this.getType(headerOption?.type);
                const defaultValue: string = String(headerOption?.defaultValue || '');
                const require: string = String(!!headerOption?.require || false);
                const description: string = headerOption?.description || '';
                return [name, type, require, defaultValue, description];
            });
        }
        return [
            { h4: 'URL参数' },
            {
                table: {
                    headers: ['参数名', '参数类型', '是否必须', '默认值', '参数描述'],
                    rows
                }
            }
        ];
    }
    /**
     * Content参数
     */
    private get body() {
        if (!(this.methodController.method.includes(ApiRequestMethod.POST) || this.methodController.method.includes(ApiRequestMethod.ALL))) {
            return [];
        }
        let rows: Array<any[]> = [['', '', '', '', '']];
        if (this.methodController.request?.body) {
            rows = Object.entries(this.methodController.request?.body).map(([key, value]) => {
                const headerOption = value;
                const name: string = key;
                const type: string = this.getType(headerOption?.type);
                const defaultValue: string = String(headerOption?.defaultValue || '');
                const require: string = String(!!headerOption?.require || false);
                const description: string = headerOption?.description || '';
                return [name, type, require, defaultValue, description];
            });
        }
        return [
            { h4: '请求体Body参数' },
            {
                table: {
                    headers: ['参数名', '参数类型', '是否必须', '默认值', '参数描述'],
                    rows
                }
            }
        ];
    }

    /**
     * 获取类型
     */
    private getType(value: any): string {
        if (value) {
            if (value === Object) {
                return 'Object';
            }
            if (value === String) {
                return 'String';
            }
            if (value === Number) {
                return 'Number';
            }
            if (value === Boolean) {
                return 'Boolean';
            }
            if (value === Array) {
                return 'Array';
            }
            return String(value);
        }
        return '';
    }
    /**
     * 调出每一个接口的文档
     * @returns
     */
    public toJSON(): Array<Object> {
        return [this.title, this.description, ...this.url, ...this.method, ...this.origins, ...this.returnType, ...this.headers, ...this.urlQuery, ...this.body];
    }
}
