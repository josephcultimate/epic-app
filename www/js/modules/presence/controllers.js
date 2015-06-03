App.ProfileController = Ember.Controller.extend({
    sortedEducations: function() {
        var educations = this.get('model').get('educations');
        var fromDateEducations = [];
        var toDateEducations = [];
        var noDateEducations = [];

        // REMARKS: Partition the data to be sorted.
        educations.forEach(function(education) {
            if (education.get('dateFrom') && !education.get('dateTo')) {
                fromDateEducations.push(education);
            } else if (education.get('dateTo')) {
                toDateEducations.push(education);
            } else {
                noDateEducations.push(education);
            }
        });

        var fromArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(fromDateEducations)
        });
        var toArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(toDateEducations)
        });
        var noDateArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(noDateEducations)
        });

        var fromSorted = fromArrayProxy.sortBy('from_year', 'from_month').reverse();
        var toSorted = toArrayProxy.sortBy('to_year', 'to_month').reverse();
        var noDateSorted = noDateArrayProxy.sortBy('school');

        return fromSorted.concat(toSorted, noDateSorted);
    }.property('content.@each.educations'),
    sortedExperiences: function() {
        var experiences = this.get('model').get('experiences');
        var fromDateExperiences = [];
        var toDateExperiences = [];
        var noDateExperiences = [];

        // REMARKS: Partition the data to be sorted.
        experiences.forEach(function(experience) {
            if (experience.get('fromDate') && !experience.get('toDate')) {
                fromDateExperiences.push(experience);
            } else if (experience.get('toDate')) {
                toDateExperiences.push(experience);
            } else {
                noDateExperiences.push(experience);
            }
        });

        var fromArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(fromDateExperiences)
        });
        var toArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(toDateExperiences)
        });
        var noDateArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(noDateExperiences)
        });

        var fromSorted = fromArrayProxy.sortBy('from_year', 'from_month').reverse();
        var toSorted = toArrayProxy.sortBy('to_year', 'to_month').reverse();
        var noDateSorted = noDateArrayProxy.sortBy('company');

        return fromSorted.concat(toSorted, noDateSorted);
    }.property('content.@each.experiences'),
    sortedCertifications: function() {
        var certifications = this.get('model').get('certifications');
        var expireDateCertifications = [];
        var noExpireDateCertifications = [];

        // REMARKS: Partition the data to be sorted.
        certifications.forEach(function(certification) {
            if (certification.get('expireDate')) {
                expireDateCertifications.push(certification);
            } else {
                noExpireDateCertifications.push(certification);
            }
        });

        var noExpireArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(noExpireDateCertifications)
        });
        var expireArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(expireDateCertifications)
        });

        var expireSorted = expireArrayProxy.sortBy('expire_year', 'expire_month', 'expire_day').reverse();
        var noExpireSorted = noExpireArrayProxy.sortBy('name');

        return noExpireSorted.concat(expireSorted);
    }.property('content.@each.certifications'),

    sortedSkills: function() {
        var skills = this.get('model').get('skills');

        var skillArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(skills)
        });

        return skillArrayProxy.sortBy('description');
    }.property('content.@each.skills'),

    showSkillsLegend: function() {
        var skills = this.get('model').get('skills');

        var isWilling = false;
        skills.some(function(skill) {
            if (skill.get('willing_to_help') == "true") { isWilling = true; }
        });

        return isWilling;
    }.property('content.@each.skills'),

    sortedHobbies: function() {
        var hobbies = this.get('model').get('hobbies');

        var hobbiesArrayProxy = Ember.ArrayProxy.create({
            content: Ember.A(hobbies)
        });

        return hobbiesArrayProxy.sortBy('name');
    }.property('content.@each.hobbies')

});