import Mn from 'backbone.marionette';
import $ from 'jquery';
import c3 from 'c3';
import 'datatables.net-bs';
import Template from './template.hbs';
// import UsersTemplate from './users-template.hbs';
// import IndicatorsTemplate from './indicators-template.hbs';
import FamiliesView from './families/index/layout-view';
import UnderConstrucionTemplate from '../../utils/under_construction_template.hbs';

import storage from '../storage';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
    this.organizationId = options.organizationId;
    this.organization = this.model.attributes;
  },

  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);

    if (this.entity == null) {
      $('#sub-header .navbar-header > .navbar-brand').addClass('subActive');
    } else {
      $(`.sub-menu-tiem > a[href$="${this.entity}"]`)
        .parent()
        .addClass('subActive');
    }
    setTimeout(() => {
      this.chart();
      this.dataTables();

    }, 0);
    console.log(this.organization );
  },

  dataTables(){
      $('#table-top-indicators').dataTable({
        "lengthMenu": [[5, 25, 50, -1], [5, 25, 50, "All"]],
        "searching": false,
        "paging" : false,
        "lengthChange": false,
        "info": false,
        "order": [[ 1, "desc" ], [ 2, "desc" ], [ 3, "desc" ]]

      });
  },

  chart(){
    c3.generate({
        bindto: '#bar-indicators',
        data: {
          columns: [
            ['Red', this.organization.id],
            ['Yellow', 5],
            ['Green', 15]
          ],
          colors:{
                Red: 'rgba(255, 0, 0, 0.8)',
                Yellow: 'rgba(255, 255, 0, 0.7)',
                Green: 'rgba(0, 128, 0, 0.7)'
              },
              names: {
                    Red: `Red:  ${this.organization.id}`,
                    Yellow: 'Yellow: 5',
                    Green: 'Green: 15'
                  },
          type: 'donut'
        },
        donut: {
          width: 50
        },
        size: {
            height: 250
          }
    });
  },

  getTemplate() {
    if (this.entity === 'families') {
      let organizationId = this.organizationId;
      this.app.showViewOnRoute(
        new FamiliesView({
          organizationId,
          app: this.app
        })
      );
      return this.$el.html('');
    }
    if (this.entity === 'users') {
      // return UsersTemplate;
      return UnderConstrucionTemplate;
    }
    if (this.entity === 'indicators') {
      // return IndicatorsTemplate;
      return UnderConstrucionTemplate;
    }


    return Template;
  },

  serializeData() {
    return {
      organization: this.model.attributes
    };
  }
});
