import React, {Component} from 'react';
import * as PropTypes from 'prop-types';

export interface I%componentName%Props {

}

export interface I%componentName%State {

}

class ArrowPanel extends Component<I%componentName%Props, I%componentName%State> {
    static propTypes : {

    };
    static defaultProps : {

    };

    render(){
        return (
            <div>Hello %componentName%</div>
        )
    }
}

export default %componentName%;