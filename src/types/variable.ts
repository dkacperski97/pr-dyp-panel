import { v4 as uuid4 } from 'uuid';
import type {IVariable} from 'components/types/variable';

class Variable implements IVariable {
    id: string;
    name: string;
    templateId?: string;
    templateParameters?: any;

	constructor(name: string, templateId?: string, templateParameters?: any) {
		this.id = uuid4();
		this.name = name;
		this.templateId = templateId;
		this.templateParameters = templateParameters;
	}
}

export default Variable;