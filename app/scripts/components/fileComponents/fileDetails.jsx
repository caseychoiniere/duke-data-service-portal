import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import { observer } from 'mobx-react';
import mainStore from '../../stores/mainStore';
import provenanceStore from '../../stores/provenanceStore';
import { Color } from '../../theme/customTheme';
import { Path } from '../../util/urlEnum';
import CustomMetadata from './customMetadata.jsx';
import FileOptionsMenu from './fileOptionsMenu.jsx';
import FileVersionsList from './fileVersionsList.jsx';
import VersionUpload from './versionUpload.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import TagCloud from '../../components/globalComponents/tagCloud.jsx';
import Tooltip from '../../util/tooltip.js';
import BaseUtils from '../../util/baseUtils.js';
import Card from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

@observer
class FileDetails extends React.Component {

    render() {
        const {entityObj, fileVersions, loading, objectMetadata, projPermissions, screenSize, uploads} = mainStore;
        const { showProvAlert } = provenanceStore;
        let prjPrm = projPermissions && projPermissions !== null ? projPermissions : null;
        let dlButton = null;
        let optionsMenu = null;
        let id = entityObj && entityObj.current_version && entityObj.current_version.id ? entityObj.current_version.id : null;
        if (prjPrm !== null) {
            dlButton = prjPrm === 'viewOnly' || prjPrm === 'flUpload' ? null :
                <button
                    title="Download File"
                    rel="tooltip"
                    className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored"
                    style={styles.downloadBtn}
                    onTouchTap={() => this.handleDownload()}>
                    <i className="material-icons">get_app</i>
                </button>;
            optionsMenu = <FileOptionsMenu {...this.props} clickHandler={()=>this.setSelectedEntity()}/>;
        }
        let ancestors = entityObj && entityObj.ancestors ? entityObj.ancestors : [];
        let parentKind = entityObj && entityObj.parent ? entityObj.parent.kind : null;
        let parentId = entityObj  && entityObj.parent ? entityObj.parent.id : null;
        let name = entityObj ? entityObj.name : '';
        let label = entityObj && entityObj.current_version && entityObj.current_version.label ? entityObj.current_version.label : null;
        let crdOn = entityObj && entityObj.audit ? entityObj.audit.created_on : null;
        let createdBy = entityObj && entityObj.audit ? entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = entityObj && entityObj.audit ? entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = entityObj && entityObj.audit.last_updated_by ? entityObj.audit.last_updated_by.full_name : null;
        let storage =  entityObj && entityObj.current_version && entityObj.current_version.upload ? entityObj.current_version.upload.storage_provider.description : null;
        let bytes = entityObj && entityObj.current_version && entityObj.current_version.upload ? entityObj.current_version.upload.size : null;
        let hash = entityObj && entityObj.current_version && entityObj.current_version.upload.hashes.length ? entityObj.current_version.upload.hashes[0].algorithm +': '+ entityObj.current_version.upload.hashes[0].value : null;
        let currentVersion = entityObj && entityObj.current_version && entityObj.current_version.version ? entityObj.current_version.version : null;
        let versionsButton = null;
        let versions = null;
        let versionCount = [];
        let width = screenSize !== null && Object.keys(screenSize).length !== 0 ? screenSize.width : window.innerWidth;
        let path = ancestors !== null ? BaseUtils.getFilePath(ancestors) : '';
        let provAlert = showProvAlert ? <Paper style={styles.provAlert} zDepth={1}>
            <div style={styles.provAlert.wrapper}>Would you like to add provenance for this file?</div>
            <IconButton style={styles.button} onTouchTap={() => this.dismissAlert()}>
                <NavigationClose color="#E8F5E9"/>
            </IconButton>
            <FlatButton
                label="Yes"
                labelStyle={styles.provAlert.alertButton.label}
                style={styles.provAlert.alertButton}
                hoverColor="#4CAF50"
                onTouchTap={() => this.openProv()}
                />
        </Paper> : '';

        if(fileVersions && fileVersions != null && fileVersions.length > 1) {
            versions = fileVersions.map((version) => {
                return version.is_deleted;
            });
            for (let i = 0; i < versions.length; i++) {
                if (versions[i] === false) {
                    versionCount.push(versions[i]);
                    if (versionCount.length > 1) {
                        versionsButton = <RaisedButton
                                            label="FILE VERSIONS"
                                            secondary={true}
                                            style={styles.button}
                                            labelStyle={{fontWeight: 100}}
                                            onTouchTap={() => this.openModal('fileVersions')} />
                    }
                }
            }
        }

        Tooltip.bindEvents();

        let file = <Card className="project-container mdl-color--white content mdl-color-text--grey-800"
                         style={styles.card}>
            <div className="mdl-cell mdl-cell--12-col" style={{position: 'relative'}}>
                { dlButton }
            </div>
            <div id="tooltip"></div>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div style={styles.menuIcon}>
                    { optionsMenu }
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={'/#/' + BaseUtils.getUrlPath(parentKind) + parentId } style={styles.back} className="mdl-color-text--grey-800 external">
                        <i className="material-icons" style={styles.backIcon}>keyboard_backspace</i>
                        Back
                    </a>
                </div>
                <div className="mdl-cell mdl-cell--9-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.title}>{ name }</span>
                </div>
                { label != null ? <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.subTitle}>
                    <span className="mdl-color-text--grey-600" style={styles.spanTitle}>{ label }</span>
                </div> : null }
                <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{ 'Version: ' + currentVersion }</span>
                </div>
                <div className="mdl-cell mdl-cell--8-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.subTitle}>
                    <span style={styles.spanTitle}>{path}  {' '+name}</span>
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.btnWrapper}>
                    { versionsButton }
                </div>
                {width >  300 ? <TagCloud {...this.props}/> : null}
                <FileVersionsList {...this.props}/>
                <VersionUpload {...this.props}/>
                <div style={styles.uploadProg}>
                    { uploads || loading ? <Loaders {...this.props}/> : null }
                </div>
                <div className="mdl-cell mdl-cell--12-col content-block" style={styles.list}>
                    { provAlert }
                    <div className="list-block">
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Created By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ createdBy }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Original File Created On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ BaseUtils.formatDate(crdOn) }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated By</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedBy === null ? 'N/A' : lastUpdatedBy}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Last Updated On</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ lastUpdatedOn === null ? 'N/A' : BaseUtils.formatDate(lastUpdatedOn) }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Size</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ bytes !== null ? BaseUtils.bytesToSize(bytes) : '' }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File ID</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ id }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Hash</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ hash }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">Storage Location</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{ storage }</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="list-group">
                            <ul>
                                <li className="list-group-title">File Path</li>
                                <li className="item-content">
                                    <div className="item-inner">
                                        <div>{path}  {' '+name}</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Card>;
        return (
            <div>
                {file}
                {objectMetadata && objectMetadata.length ? <CustomMetadata {...this.props}/> : null}
            </div>
        )
    }

    dismissAlert(){
        provenanceStore.hideProvAlert();
    }

    handleDownload(){
        let id = this.props.params.id;
        mainStore.getDownloadUrl(id, Path.FILE);
    }

    openModal(id) {
        mainStore.toggleModals(id)
    }

    openProv() {
        let versionId = mainStore.entityObj.current_version.id;
        provenanceStore.getWasGeneratedByNode(versionId);
        provenanceStore.toggleProvView();
        provenanceStore.toggleProvEditor();
        provenanceStore.hideProvAlert();
    }

    setSelectedEntity() {
        let id = this.props.params.id;
        mainStore.setSelectedEntity(id, Path.FILE);
    }
}

var styles = {
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    back: {
        verticalAlign:-7
    },
    btnWrapper: {
        margin: '11px 25px 20px 8px',
        float: 'right'
    },
    button: {
        float: 'right'
    },
    card: {
        paddingBottom: 30,
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25
    },
    downloadBtn: {
        position: 'absolute',
        top: -33,
        right: '1.4%',
        zIndex: '2',
        color: '#ffffff'
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    menuIcon: {
        float: 'right',
        marginTop: 30,
        marginBottom: -3
    },
    provAlert: {
        display: 'block',
        overflow: 'auto',
        backgroundColor: Color.green,
        minHeight: 48,
        alertButton: {
            float: 'right',
            margin: 6,
            label: {
                color: '#E8F5E9',
                fontWeight: 100
            }
        },
        wrapper: {
            float: 'left',
            color: '#E8F5E9',
            margin: '14px 10px 10px 10px'
        }
    },
    subTitle: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25,
        marginTop: 18
    },
    spanTitle: {
        fontSize: '1.2em'
    },
    title: {
        fontSize: 24,
        wordWrap: 'break-word'
    },
    uploadProg: {
        marginBottom: -35
    }
};

FileDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

FileDetails.propTypes = {
    loading: bool,
    showProvAlert: bool,
    fileVersions: array,
    objectMetadata: array,
    uploads: array,
    entityObj: object,
    screenSize: object,
    projPermissions: string
};

export default FileDetails;