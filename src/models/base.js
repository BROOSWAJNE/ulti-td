import * as axios from 'axios';
import * as _ from 'lodash';

const Model = function(opts) {
    const self = this;

    this.id = opts.id;

    const type = opts.type;

    this.fetching = false;
    this.fetched = false;
    this.model = opts.model || {};

    this.fetch = function(opts) {
        self.fetching = true;

        let success = function(res) {
            self.fetched = true;

            self.model = res.data;

            _.isFunction(opts.success) && opts.success.apply(this, arguments);
        };

        let error = function(err) {
            console.error(err);

            _.isFunction(opts.error) && opts.error.apply(this, arguments);
        };

        let complete = function() {
            self.fetching = false;

            _.isFunction(opts.complete) && opts.complete.apply(this, arguments);
        };

        axios.get('/api/' + type + '/' + self.id)
            .then(success)
            .catch(error)
            .then(complete);
    };
};

const Collection = function(opts) {
    const self = this;

    const type = opts.type;
    const model_constructor = opts.model_constructor || Model;

    this.fetching = false;
    this.fetched = false;
    this.models = opts.models || [];

    this.fetch = function(opts) {
        self.fetching = true;

        let success = function(res) {
            self.fetched = true;

            self.models = _.map(res.data, (model) => {
                return new model_constructor({ model: model });
            });

            _.isFunction(opts.success) && opts.success.apply(this, arguments);
        };

        let error = function(err) {
            console.error(err);

            _.isFunction(opts.error) && opts.error.apply(this, arguments);
        };

        let complete = function() {
            self.fetching = false;

            _.isFunction(opts.complete) && opts.complete.apply(this, arguments);
        };

        axios.get('/api/' + type)
            .then(success)
            .catch(error)
            .then(complete);
    };
};

export { Model, Collection };
