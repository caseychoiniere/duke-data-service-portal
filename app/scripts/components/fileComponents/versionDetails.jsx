import React, { PropTypes } from 'react';
const { object, bool, array, string } = PropTypes;
import ProjectActions from '../../actions/projectActions';
import ProjectStore from '../../stores/projectStore';
import VersionOptionsMenu from './versionOptionsMenu.jsx';
import Loaders from '../../components/globalComponents/loaders.jsx';
import urlGen from '../../../util/urlGen.js';
import Tooltip from '../../../util/tooltip.js';
import BaseUtils from '../../../util/baseUtils.js';
import Card from 'material-ui/lib/card/card';

class VersionDetails extends React.Component {

    render() {
        if (this.props.error && this.props.error.response){
            this.props.error.response === 404 ? this.props.appRouter.transitionTo('/notFound') : null;
            this.props.error.response != 404 ? console.log(this.props.error.msg) : null;
        }
        let loading = this.props.loading ?
            <div className="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div> : '';
        let id = this.props.params.id;
        let parentId = this.props.entityObj && this.props.entityObj.file ? this.props.entityObj.file.id : null;
        let name = this.props.entityObj && this.props.entityObj.file ? this.props.entityObj.file.name : null;
        let label = this.props.entityObj && this.props.entityObj.label ? this.props.entityObj.label : null;
        let projectName = this.props.entityObj && this.props.entityObj.ancestors ? this.props.entityObj.ancestors[0].name : null;
        let crdOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_on : null;
        let x = new Date(crdOn);
        let createdOn = x.toString();
        let createdBy = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.created_by.full_name : null;
        let lastUpdatedOn = this.props.entityObj && this.props.entityObj.audit ? this.props.entityObj.audit.last_updated_on : null;
        let lastUpdatedBy = this.props.entityObj && this.props.entityObj.audit.last_updated_by ? this.props.entityObj.audit.last_updated_by.full_name : null;
        let storage =  this.props.entityObj && this.props.entityObj.upload ? this.props.entityObj.upload.storage_provider.description : null;
        let bytes = this.props.entityObj && this.props.entityObj.upload ? this.props.entityObj.upload.size : null;
        let hash = this.props.entityObj && this.props.entityObj.upload.hash ? this.props.entityObj.upload.hash.algorithm +': '+ this.props.entityObj.upload.hash.value : null;
        let versNumber = this.props.entityObj ? this.props.entityObj.version : null;
        Tooltip.bindEvents();

        let version = <Card className="project-container mdl-color--white content mdl-color-text--grey-800" style={styles.container}>
            <button
                title="Download This Version"
                rel="tooltip"
                className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--mini-fab mdl-button--colored"
                style={styles.floatingButton}
                onTouchTap={this.handleDownload.bind(this)}>
                <i className="material-icons">get_app</i>
            </button>
            <div id="tooltip"></div>
            <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800">
                <div style={styles.menuIcon}>
                    <VersionOptionsMenu {...this.props} {...this.state}/>
                </div>
                <div className="mdl-cell mdl-cell--12-col mdl-color-text--grey-800" style={styles.arrow}>
                    <a href={urlGen.routes.baseUrl + 'file/' + parentId } style={styles.back}
                       className="mdl-color-text--grey-800 external">
                        <i className="material-icons"
                           style={styles.backIcon}>keyboard_backspace</i>Back</a>
                </div>
                <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-800" style={styles.title}>{ name }</span>
                </div>
                <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet mdl-color-text--grey-600" style={styles.path}>
                    <span style={styles.spanTitle}>{ 'Version: ' + versNumber }</span>
                </div>
                {label != null ? <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet mdl-cell--4-col-phone" style={styles.detailsTitle}>
                    <span className="mdl-color-text--grey-600" style={styles.label}>{label}</span>
                </div> : null}
                <div className="mdl-cell mdl-cell--12-col content-block"  style={styles.list}>
                    <div className="list-block">
                        <ul>
                            <li className="item-divider">Created By</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ createdBy }</div>
                                </div>
                            </li>
                            <li className="item-divider">Created On</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ createdOn }</div>
                                </div>
                            </li>
                            <li className="item-divider">Size</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ BaseUtils.bytesToSize(bytes) }</div>
                                </div>
                            </li>
                            <li className="item-divider">Version ID</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ id }</div>
                                </div>
                            </li>
                            <li className="item-divider">Hash</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ hash }</div>
                                </div>
                            </li>
                            <li className="item-divider">Last Updated By</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ lastUpdatedBy === null ? 'N/A' : lastUpdatedBy }</div>
                                </div>
                            </li>
                            <li className="item-divider">Last Updated On</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ lastUpdatedOn === null ? 'N/A' : lastUpdatedOn }</div>
                                </div>
                            </li>
                            <li className="item-divider">Storage Location</li>
                            <li className="item-content">
                                <div className="item-inner">
                                    <div>{ storage }</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Card>;
        return (
            <div>
                {version}
                <Loaders {...this.props}/>
            </div>
        )
    }

    handleDownload(){
        let id = this.props.params.id;
        let kind = 'file_versions/';
        ProjectActions.getDownloadUrl(id, kind);
    }

    openModal() {
        ProjectActions.openModal()
    }
}

var styles = {
    btnWrapper: {
        marginTop: 11,
        marginRight: 25,
        float: 'right'
    },
    button: {
        float: 'right'
    },
    container: {
        marginTop: 30,
        marginBottom: 30,
        position: 'relative',
        overflow: 'visible',
        padding: '10px 0px 10px 0px'
    },
    path: {
        textAlign: 'left',
        float: 'left',
        marginLeft: 25,
        marginTop: 18
    },
    list: {
        paddingTop: 5,
        clear: 'both'
    },
    backIcon: {
        fontSize: 24,
        verticalAlign:-7
    },
    arrow: {
        textAlign: 'left',
        marginTop: -5
    },
    back: {
        verticalAlign:-7
    },
    detailsTitle: {
        textAlign: 'left',
        float: 'left'
    },
    spanTitle: {
        fontSize: '1.2em'
    },
    title: {
        fontSize: 24,
        marginLeft: 18
    },
    label: {
        marginLeft: 18
    },
    floatingButton: {
        position: 'absolute',
        top: -20,
        right: '2%',
        zIndex: '2',
        color: '#ffffff'
    },
    menuIcon: {
        float: 'right',
        marginTop: 30,
        marginBottom: -3,
        marginRight: 10
    }
};

VersionDetails.contextTypes = {
    muiTheme: React.PropTypes.object
};

VersionDetails.propTypes = {
    loading: bool,
    details: array,
    error: object
};

export default VersionDetails;