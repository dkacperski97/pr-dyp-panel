class Editor {
    screenshots: any;
    activePage: string|undefined;
    activeComponent: string|undefined;
	showLayout: boolean;

	constructor() {
		this.screenshots = {};
		this.activePage = undefined;
		this.activeComponent = undefined;
		this.showLayout = false;
	}
}

export default Editor;