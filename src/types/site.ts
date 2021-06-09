// import { v4 as uuid4 } from 'uuid';
import type {ISiteConfig} from 'components/types/site';
import Variable from './variable';
import ComponentConfig from './component';

class SiteConfig implements ISiteConfig {
    variables: Variable[];
    options: any;
    components: ComponentConfig[];

	constructor(variables: Variable[] = [ new Variable('routes', 'routes') ], options: any = {}, components: ComponentConfig[] = []) {
		this.options = options;
		this.variables = variables;
		this.components = components;
	}
}

export default SiteConfig;