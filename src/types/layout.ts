import { v4 as uuid4 } from 'uuid';

class Layout {
	id: string;
	componentId: string;
	config: any;
	children: string[];

	constructor(componentId: string, config: any = {}, children: string[] = []) {
		this.id = uuid4();
		this.componentId = componentId;
		this.config = config;
		this.children = children;
	}
}

export default Layout;