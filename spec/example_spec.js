describe("Make sure tests are working", function() {

    it("should be able to add", function() {
        expect(1+2).toBe(3);
    });
    it("should be able to add more", function() {
        expect(2+2).toBe(4);
    });
});



describe("directive: how to test simple directive", function() {

  beforeEach(function() {
      // provided by ngMock
    module("app");
  });

  beforeEach(inject(function($rootScope, $compile) {
    this.html = "<mike>no text</mike>";
    this.scope = $rootScope.$new();
    this.elem = $compile(this.html)(this.scope);

    // you HAVE to call $digest here.. or the element might never get populated.
    // the directive acts differently depending on whether or not you have a template
    // vs a templateUrl.
    this.scope.$digest();
  }));

  describe("look at mike directive", function() {
        it("should have the defined content and scope", function() {
            // the mike directive controller sets the scope.message to be "MIKE WAS HERE".
            expect(this.scope.message).toBe("MIKE WAS HERE");

            // the html in mike.html sets the text to "mike.html from a template"
            expect(this.elem.html()).toContain("from a template");
        });
  });

});

