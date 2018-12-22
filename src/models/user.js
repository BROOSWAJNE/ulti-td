import * as Base from './base';
import * as _ from 'lodash';

const Model = function(opts) {
    opts = _.extend(opts, {
        type: 'users'
    });

    Base.Model.call(this, opts);
};

const Collection = function(opts) {
    opts = _.extend(opts, {
        type: 'users',
        model_constructor: Model
    });

    Base.Collection.call(this, opts);
};

export { Model, Collection };
