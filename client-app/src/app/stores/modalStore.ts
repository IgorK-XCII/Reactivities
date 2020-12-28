import { action, makeObservable, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
    constructor(private rootStore: RootStore) {
        makeObservable(this, {
            modal: observable,
            openModal: action,
            closeModal: action
        })
    }

    modal = {
        open: false,
        body: null
    }

    openModal = (content: any) => {
        this.modal.open = true;
        this.modal.body = content;
    }

    closeModal = () => {
        this.modal.open = false;
        this.modal.body = null;
    }
}