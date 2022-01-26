import { v4 as uuid4 } from 'uuid';
import type {ISiteConfig} from 'components/types/site';
import Variable from './variable';
import ComponentConfig from './component';

class SiteConfig implements ISiteConfig {
	id: string;
    variables: Variable[];
    options: any;
    components: ComponentConfig[];

	constructor(id: string, variables: Variable[] = [ new Variable('routes', 'routes'), new Variable('client', 'apolloClient', { uri: "http://sem6:4000/graphql" }) ], options: any = {}, components: ComponentConfig[] = []) {
		this.id = id;
		this.options = options;
		this.variables = variables;
		this.components = components;
	}
}

export default SiteConfig;