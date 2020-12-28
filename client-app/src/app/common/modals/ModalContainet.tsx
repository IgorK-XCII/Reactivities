import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Modal } from 'semantic-ui-react'
import { rootStoreContext } from '../../stores/rootStore';

const ModalContainet: React.FC = () => {
    const {
        modalStore: {
            modal: { open, body },
            closeModal
        }
    } = useContext(rootStoreContext);

    return (
        <Modal open={open} onClose={closeModal} size='mini'>
            <Modal.Content>
                {body}
            </Modal.Content>
        </Modal>
    );
};

export default observer(ModalContainet);
