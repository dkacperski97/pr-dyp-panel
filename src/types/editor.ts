class Editor {
    screenshots: any;
    activePage: string|undefined;
    activeComponent: string|undefined;

	constructor() {
		this.screenshots = {};
		this.activePage = undefined;
		this.activeComponent = undefined;
	}
}

export default Editor;