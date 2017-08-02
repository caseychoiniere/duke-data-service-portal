import React, { PropTypes } from 'react';
const { object } = PropTypes;
import { observer } from 'mobx-react';
import { Color } from '../../theme/customTheme';
import mainStore from '../../stores/mainStore';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

@observer
class VersionUpload extends React.Component {

    render() {
        const { entityObj, toggleModal, screenSize, selectedEntity } = mainStore;
        let dialogWidth = screenSize.width < 580 ? {width: '100%'} : {};
        let open = toggleModal && toggleModal.id === 'newVersionModal' ? toggleModal.open : false;
        let fileId = selectedEntity !== null ? selectedEntity.id : entityObj !== null ? entityObj.id : null;
        let parentId = selectedEntity !== null ?  selectedEntity.parent.id : entityObj !== null && entityObj.parent ? entityObj.parent.id : null;
        let projectId = entityObj && entityObj.ancestors ? entityObj.ancestors[0].id : selectedEntity !== null ? selectedEntity.ancestors[0].id : null;
        let parentKind = entityObj && entityObj.parent ? entityObj.parent.kind : selectedEntity !== null ? selectedEntity.parent.kind : null;

        let standardActions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.handleClose()} />,
            <FlatButton
                label="Submit"
                secondary={true}
                onTouchTap={() => this.handleUploadButton(fileId, parentId, projectId, parentKind)} />
        ];
        return (
            <div style={styles.fileUpload}>
                <Dialog
                    style={styles.dialogStyles}
                    contentStyle={dialogWidth}
                    title='Upload New Version'
                    autoDetectWindowHeight={true}
                    actions={standardActions}
                    onRequestClose={this.handleClose.bind(this)}
                    open={open}>
                    <div className="mdl-cell mdl-cell--6-col" style={{margin: '0 auto'}}>
                    <form action='#' id='newFileForm'>
                        <div className="mdl-cell mdl-cell--6-col mdl-textfield mdl-textfield--file">
                            <textarea className="mdl-textfield__input mdl-color-text--grey-800" placeholder="File" type="text" ref={(input) => this.fileList = input} rows="3" readOnly></textarea>
                            <div className="mdl-button mdl-button--icon mdl-button--file">
                                <i className="material-icons" style={styles.iconColor}>file_upload</i>
                                <input type='file' ref={(input) => this.fileInput = input} onChange={this.handleFileName.bind(this)} />
                            </div>
                        </div> <br/>
                        <TextField
                            style={styles.textStyles}
                            hintText="Optional Label"
                            floatingLabelText="Label"
                            floatingLabelStyle={{color: Color.dkGrey}}
                            ref={(input) => this.labelText = input}
                            type="text"
                            multiLine={true}/> <br/>
                    </form>
                    </div>
                </Dialog>
            </div>
        );
    }

    handleUploadButton(fileId, parentId, projectId, parentKind) {
        if (this.fileInput.value) {
            let fileList = this.fileInput.files;
            for (let i = 0; i < fileList.length; i++) {
                let blob = fileList[i];
                let label = this.labelText.getValue() && this.labelText.getValue() !== '' ? this.labelText.getValue() : null;
                mainStore.startUpload(projectId, blob, parentId, parentKind, label, fileId);
                mainStore.toggleModals('newVersionModal');
            }
        } else {
            return null
        }
    }

    handleFileName() {
        let fList = [];
        let fileList;
        let fl = this.fileInput.files;
        for (let i = 0; i < fl.length; i++) {
            fList.push(fl[i].name);
            fileList = fList.toString().split(',').join(', ');
        }
        this.fileList.value = 'Preparing to upload: ' + fileList;
    }

    handleClose() {
        mainStore.toggleModals('newVersionModal');
    }
}

const styles = {
    fileUpload: {
        float: 'right',
        position: 'relative',
        margin: '12px 8px 0px 0px',
    },
    iconColor: {
        color: Color.pink
    },
    dialogStyles: {
        zIndex: '9996',
        textAlign: 'center',
        fontColor: Color.dkBlue
    },
    textStyles: {
        minWidth: '48%',
        textAlign: 'left',
        fontColor: Color.dkBlue,
        width: 286
    },
    floatingButton: {
        position: 'absolute',
        top: -50,
        marginRight: 17,
        right: '2%',
        zIndex: '2',
        color: '#fff'
    },
    msg: {
        textAlign: 'center',
        marginLeft: 30
    }
};

VersionUpload.contextTypes = {
    muiTheme: React.PropTypes.object
};

VersionUpload.propTypes = {
    entityObj: object,
    toggleModal: object,
    screenSize: object,
    selectedEntity: object
};

export default VersionUpload;