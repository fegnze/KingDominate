// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class HotUpdate extends cc.Component {

    @property({
        type: cc.ProgressBar,
        displayName: "进度条组件"
    })
    progress: cc.ProgressBar = null;

    @property({
        type: cc.Node,
        displayName: "更新检查提示框"
    })
    checkPanel: cc.Node = null;

    @property({
        type: cc.Node,
        displayName: "错误提示框"
    })
    alert: cc.Node = null;

    @property({
        type: cc.Asset,
    })
    manifestUrl: cc.Asset = null;

    @property
    private _storagePath: string = '';

    @property
    private _am: any = null;

    onLoad() {
        this.progress.progress = 0;
        if (!cc.sys.isNative) return;
        this.checkPanel.on('start-Update', (event: any) => {
            this.hotUpdate();
        }, this);
        //设置更新下载路径
        this._storagePath = (jsb.fileutils ? jsb.fileutils.getWritablePath() : '/Users/fegnze/Desktop/tmp/') + 'fegnze-remote-asset';
        cc.log('远程资源存储路径 : ' + this._storagePath);

        // Init with empty manifest url for testing custom manifest
        // 创建 AssetsManager
        // var assetsManager = new jsb.AssetsManager(manifestUrl, storagePath);
        this._am = new jsb.AssetsManager(this.manifestUrl.nativeUrl, this._storagePath, this.versionCompareHandle.bind(this));
        // 下载后文件校验
        /*
            由于下载过程中仍然有小概率可能由于网络原因或其他网络库的问题导致下载的文件内容有问题，
            所以我们提供了用户文件校验接口，在文件下载完成后热更新管理器会调用这个接口（用户实现的情况下），
            如果返回 true 表示文件正常，返回 false 表示文件有问题。
        */
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback((filePath: string, asset: any) => {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            let compressed = asset.compressed;
            if (compressed) {
                // panel.info.string = "Verification passed : " + relativePath;
                return true;
            } else {
                // asset.path is relative path and path is absolute.
                let expectedMD5 = asset.md5;
                // The size of asset file, but this value could be absent.
                let size = asset.size;
                // panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
                /*
                由于 Manifest 中的资源版本建议使用 md5 码，那么在校验函数中计算下载文件的 md5 码去和 asset 的 md5 码比对即可判断文件是否正常。
                除了 md5 信息之外，asset 对象还包含下面的属性：
                md5： md5 码
                path： 服务器端相对路径
                compressed： 是否为压缩文件
                size： 文件尺寸
                downloadState： 下载状态，包含 UNSTARTED、DOWNLOADING、SUCCESSED、UNMARKED
                */
                /*
                var md5 = calculateMD5(filePath);
                if (md5 === asset.md5)
                    return true;
                else
                    return false;
                */
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);//设置并发,需测试
            // this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        } else {
            this._am.setMaxConcurrentTask(8);
        }

        this.checkUpdate();
    }

    versionCompareHandle(versionA: string, versionB: string) {
        cc.log("版本对比: version A is " + versionA + ', version B is ' + versionB);
        let vA = versionA.split('.');
        let vB = versionB.split('.');
        for (let i = 0; i < vA.length; ++i) {
            let a = parseInt(vA[i]);
            let b = parseInt(vB[i] || '0');
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    }

    retry() {
        //这个接口调用之后，会重新进入热更新流程，仅下载之前失败的资源，整个流程是和正常的热更新流程一致的
        //this._am.downloadFailedAssets();
    }

    checkCb(event: any) {
        let errmsg = '';
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                errmsg = '[检查事件]:未发现本地manifest文件.';
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                errmsg = '[检查事件]:下载远程manifest文件失败.';
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                errmsg = '[检查事件]:解析远程manifest文件失败.';
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('[检查事件]:已更新到最新版本.');
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('[检查事件]:发现新版本,准备更新.');
                // this._am.setEventCallback(null);
                let sizeLabel: cc.Label = this.checkPanel.getComponent('UpdateCheckPanel').sizeLabel;
                sizeLabel.string = '' + event.getTotalBytes();

                this.checkPanel.active = true;
                break;
            default:
                return;
        }
        if (errmsg !== '') {
            cc.log(errmsg);
            this.alert.getComponent('Alert').msg.string = '[检查事件]:' + errmsg;
            this.alert.active = true;
        }
    }

    updateCb(event: any) {
        let errmsg = '';
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST://未找到本地manifest
                errmsg = '[更新事件]:未找到本地manifest,跳过更新.';
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST://远程manifest下载失败
                errmsg = '[更新事件]:下载远程manifest文件失败,跳过更新.';
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST://远程mainfest解析失败
                errmsg = '[更新事件]:解析远程mainfest文件失败,跳过更新.';
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS://资源文件解压失败(如果下载的文件需要解压)
                errmsg = '[更新事件]:资源文件解压失败: ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION://通知下载进度
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();
                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                this.progress.progress = event.getPercent();
                let text: cc.Label = this.progress.getComponent('ProgressBarLogic').pText;
                text.string = event.getPercent() / 100 + '%';
                var msg = event.getMessage();
                if (msg) {
                    let topTip: cc.Label = this.progress.getComponent('ProgressBarLogic').topTip;
                    topTip.string = msg;
                }
                break;
            case jsb.EventAssetsManager.ASSET_UPDATE://资源下载成功
                let topTip: cc.Label = this.progress.getComponent('ProgressBarLogic').topTip;
                topTip.string = "[更新事件]:资源下载成功,校验中...";
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING://资源下载失败
                errmsg = '[更新事件]:资源下载失败: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED://更新失败(所有下载进程结束,检查到有下载失败的资源)
                /*
                当下载过程中出现异常，比如下载失败、解压失败、校验失败，最后都会触发 UPDATE_FAILED 事件
                此时热更新管理器中记录了所有失败的资源列表
                可以通过AssetsManager.downloadFailedAssets()进行失败资源的下载重试
                */
                errmsg = '[更新事件]:更新失败,重试... ' + event.getMessage();
                this.retry();
                return;
            case jsb.EventAssetsManager.UPDATE_FINISHED://更新完成
                cc.log('[更新事件]:更新完成. ' + event.getMessage());
                this._am.setEventCallback(null);
                // Prepend the manifest's search path
                var searchPaths = jsb.fileUtils.getSearchPaths();
                var newPaths = this._am.getLocalManifest().getSearchPaths();
                cc.log(JSON.stringify(newPaths));
                Array.prototype.unshift.apply(searchPaths, newPaths);
                // This value will be retrieved and appended to the default search path during game startup,
                // please refer to samples/js-tests/main.js for detailed usage.
                // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                cc.game.restart();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE://已更新到最新版本
                cc.log('[更新事件]:已更新到最新版本...');
                break;
            default:
                break;
        }

        if (errmsg !== '') {
            cc.log(errmsg);
            this.alert.getComponent('Alert').msg.string = '[更新事件]:' + errmsg;
            this.alert.active = true;
        }
    }

    checkUpdate() {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            let url = this.manifestUrl.nativeUrl;
            //如果开了md5,转换下url
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        // 取一下本地manifest,看看有没有加载
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            let errmsg = '加载本地manifest文件失败 ...';
            cc.log(errmsg);
            this.alert.getComponent('Alert').msg.string = errmsg;
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
    }

    hotUpdate() {
        if (this._am) {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                let url = this.manifestUrl.nativeUrl;
                //如果开了md5,转换下url
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._am.setEventCallback(this.updateCb.bind(this));
            this._am.update();
        }
    }

    onDestroy() {
        this._am.setEventCallback(null);
    }
}
