window.Attendances = Ember.Application.create();

Attendances.ApplicationAdapter = DS.FixtureAdapter.extend();

Attendances.Store = DS.Store.extend();

Attendances.Router.map(function() {
    this.resource('students', {
        path: '/'
    });
});

Attendances.Student = DS.Model.extend({
    name: DS.attr('string'),
    rank: DS.attr('string'),
    email: DS.attr('string'),
    phone: DS.attr('string'),
});

Attendances.Student.FIXTURES = [{
    name: "John Aughey",
    rank: '2nd kyu',
    email: 'jha@aughey.com',
    phone: '314-610-8764'
}, {
    name: "John Feaster",
    rank: '2nd kyu',
    email: 'feaster@somthineg.com',
    phone: '314-610-12345'
}]


Attendances.AttendanceRoute = Ember.Route.extend({
    model: function() {
        console.log("model called");
        console.log(this.store);
        return this.store.find('students');
    }
});