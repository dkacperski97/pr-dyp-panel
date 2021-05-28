import { v4 as uuid4 } from 'uuid';
import type {IComponentConfig} from 'components/types/component';
import Variable from './variable';

class ComponentConfig implements IComponentConfig {
    id: string;
    name: string;
    templateId: string;
    variables: Variable[];
    options: any;
    children: string[];

	constructor(name: string, templateId: string, variables: Variable[] = [], options: any = {}, children: string[] = []) {
		this.id = uuid4();
        this.name = name;
		this.templateId = templateId;
        this.variables = variables;
        this.options = options;
		this.children = children;
	}
}

export default ComponentConfig;