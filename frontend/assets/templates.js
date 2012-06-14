(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['blocks'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        <a class=\"product\" href=\"";
  foundHelper = helpers.link;
  stack1 = foundHelper || depth0.link;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "link", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n            <div class=\"product-image\">\n                <img class=\"not-loaded\" src=\"";
  foundHelper = helpers.image;
  stack1 = foundHelper || depth0.image;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "image", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\">\n            </div>\n            <h1>";
  foundHelper = helpers.title;
  stack1 = foundHelper || depth0.title;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
  buffer += escapeExpression(stack1) + "</h1>\n        </a>\n    ";
  return buffer;}

  buffer += "<div id=\"products\">\n    ";
  foundHelper = helpers.blocks;
  stack1 = foundHelper || depth0.blocks;
  stack2 = helpers.each;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = {};
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  stack1 = stack2.call(depth0, stack1, tmp1);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;});
templates['faqs'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"faqs\">\n    <ul>\n        <li>\n            How does your pricing work?\n        </li>\n\n        <li>\n            Where do you ship from?\n        </li>\n\n        <li>\n            What is the lead time?\n        </li>\n\n        <li>\n            How are your prices so low?\n        </li>\n\n        <li>\n            Can I get a sample before I order?\n        </li>\n\n        <li>\n            Can you just mail (USPS) me a free sample?\n        </li>\n\n        <li>\n            What if I don't have a UPS or FedEx shipper number?\n        </li>\n\n        <li>\n            How much does it cost to add my company logo and/or company info to your products?\n        </li>\n\n        <li>\n            What format does my artwork need to be in?\n        </li>\n\n        <li>\n            Where do I send my artwork?\n        </li>\n\n        <li>\n            How much does it cost for extra colors or locations?\n        </li>\n\n        <li>\n            Is RUSH production available?\n        </li>\n\n        <li>\n            How do I pay?\n        </li>\n\n        <li>\n            Do you offer price matching?\n        </li>\n\n        <li>\n            I noticed a product on your website last week, but now it is no longer listed!\n        </li>\n\n        <li>\n            I noticed a product on your website last week, but now it is listed for a higher price!\n        </li>\n\n        <li>\n            How frequently do you send DiscountAlerts&trade?\n        </li>\n    </ul>\n</div>";});
templates['catalog'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"catalog\">\n    <strong>Note:</strong> This catalog does not include our closeout items. To view our closeout items <a href=\"#/products\">click here</a>. To order any of the products listed below. Please <a href=\"#/contactus\">contact us</a> in order to ensure the best possible price!\n    </p>\n    <iframe src=\"http://www.distributorcentral.com/websites/SuperCheapPromos/catalog.cfm?strip=1&CatalogGUID=18f2680e-6d0f-4d9f-be23-a5777cd3112d&StartLevel=2\" width=\"90%\" height=\"850\" frameborder=\"0\"></iframe>\n</div>";});
templates['contactus'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"contactus\">\n    <h1>Contact Us</h1>\n</div>";});
templates['alerts'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"alerts\">\n    <h1>DiscountAlerts&trade;</h1>\n</div>";});
templates['home'] = template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var foundHelper, self=this;


  return "<div id=\"home\">\n    <h1>Newest Closeouts</h1>\n</div>";});
})();