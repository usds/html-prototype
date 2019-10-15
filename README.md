## To run

```
$ npm install
$ bundle exec jekyll serve
```

### Updating USWDS to a later version.

There are a couple ways to update the USWDS:

#### Change theme settings

This site uses custom USWDS theme settings in `./assets/uswds-theme`. Use this if you want to include or remove utilities or update utility settings.

1. Compile usds.css `gulp uswds-build-sass`
2. Run jekyll `bundle exec jekyll serve`


#### Only update the USDS.css without getting new functions and tokens for use in usds.gov project files

Use this to patch any display bugs through updates to USWDS.

1. Install the package `npm install --save-dev *new-USWDS-version-number*`
2. Compile usds.css `gulp uswds-build-sass`
3. Run jekyll `bundle exec jekyll serve`

#### Update USDS and get new functions and tokens for use in usds.gov project files

This will will update some of the scss files in `./assets/uswds-sass`, but will not overwrite any of your files in `./assets/uswds-theme`.

1. Install the package `npm install --save-dev *new-USWDS-version-number*`
2. Run `gulp update`
3. Compile usds.css `gulp uswds-build-sass`
4. Run Jekyll `bundle exe

---

## How the prototype scripting works

When submitting the form, data will be pushed to session storage and pulled back immediate so that based on answers, you can link to different pages or perform other kinds of actions.

To do this, you'll need to have this snippet at the bottom of each page:

```html
<script>
  $(document).ready(function() {
    $('form').on('submit', function() {
      if (!checkValidityIfSupported($('form').get(0))) {
        return false;
      }
      else {
        nextPage("next-page.html");
        return false;
      }
    });
  });
</script>
```

When we run `updateStoredData()`, we are taking the `value` entered in any type of input and placing that in the session storage as a key/value pair. The **key** is saved as a variable. So lets you want to drive people named "Bob" to one page and everyone else to another page. You would need to have this input in your form:

```html
<input id="first_name" name="first_name" type="text" >
```

Then in the `<script>` at the bottom you can do:
```html
<script>
  $(document).ready(function() {
    $('form').on('submit', function() {
      if (!checkValidityIfSupported($('form').get(0))) {
        return false;
      }
      else {
        updateStoredData();

        if (first_name == "Bob") {
          nextPage("bob.html");
        }
        else {
          nextPage("others.html");
        }
        return false;
      }
    });
  });
</script>
```

---

### Follow-up questions
In some forms, you may want to ask an inline follow-up if a user selects a specific answer. This is enabled on radios, select boxes, and checkboxes using a mix of `data` attributes and `id` attributes.

On the form element that triggers a follow-up, use the `data-followup` attribute with a value that corresponds to the `id` of element you wish toggle on and off. The follow-up can appear in any part of the DOM and can include any type of content. For accessibility, also use `aria-controls` and `aria-expanded` attributes.

```html
<input id="other" type="radio" name="historical_figure" value="Other" data-followup="historical-figure-followup" data-controls="historical-figure-followup" aria-expanded="false" required>
<label for="other">Other</label>
<div id="historical-figure-followup" hidden>
    <label for="other-hero">Specify</label>
    <input type="text" id="other-hero" disabled>
</div>
```

#### Select Boxes
For Select boxes, put the `data-followup` on the `<option>`.

```html
<label for="additional_field">Additional Field?</label>
<select name="additional_field" id="additional_field">
  <option value=""></option>
  <option value="no">No</option>
  <option value="yes" data-followup="additional_field_q">Yes</option>
</select>
<div id="additional_field_q" hidden aria-hidden="true">
    <label for="g">What is it?</label>
    <input type="text" id="g" >
</div>
```

---

### Printing Form Data

Form data can be printed in either inputs or HTML elements using the `data-print` attribute. The value of that attribute should equal the ID of the corresponding input. So, if we wanted to greet Bob on his page, we would write:

```html
<p>Welcome to your very own page, <span data-print="first_name"></span><p>
```

If you were persisting data in a form, you can add the `data-print` attribute to an input. The ID doesn't have to match:

```htom
<input id="first_name" name="first_name" type="text" data-print="first_name">
```

[This is work in progress. See review.html for all currently available printing options. ]

---

### URL Parameters
Any page loaded with a URL parameter or parameters will be stored as key/value pairs in `sessionStorage`. For example, when you visit a page as `http://site.com?foo=bar`, your sessionStorage will be updated with `foo: "bar"` to use later.

### Filtering Content on the page
Filtering content will allow you to handle multiple states on a single page. For example, let's say you have a page that would show some content that is conditional upon some stored data. You can use the data attribute `data-filter-[STORED_ID]="[STORED_ID_VALUE]"` to keep it on the page. If the `STORED_ID_VALUE` attribute does not match what is in your session data, the element will be removed from the DOM.

If filtering content, **use underscores as separators, note hyphens**

```html
// Session Data { foo: "bar" }

<div data-filter-foo="bar">     // Element stays on page
<div data-filter-foo="baz">     // Element is removed
<div data-filter-foo="bar baz"> // Element stays on page
```

---

### Using Jekyll includes for the form fields

All form fields in the prototype are handled by Jekyll includes. Here are includes for the following types of input includes and the parameters they accept.

All form fields are required by default unless the optional parameter is passed into the include.

#### Text (with a param, could be modified to be any basic text input)

If fields are not indicated as required, they do not need to be included.

```html
{% include form-fields/_text-field.html
  id="first_name"                            
  label_text="Form label"                    
%}
```

##### Required parameters

- `id="foo_bar"`: Needs to use underscores. Maps to `name` and `id` attributes.
- `label_text="Foo bar"`: This is the label text.

##### Optional Parameters

- `label_classes="class1 class2"`: Adds class names to the label. Can use one or multiple.
- `optional="true"`: Only accepts "true", makes form field optional instead of required by removing the `required` attribute. Also adds "(Optional)" next to the label text.
- `hint="This is some hint text"`: Hint text under the label
- `type="email"`: Can be any HTML5 input type (sample displays email). By default, inputs are `type="text"`.
- `input_classes="class1 class2"`: Adds class names to the input. Can use one or multiple.
- `prepopulate="session_storage_id"`: Pre-populates the form field with data from any `sessionStorage` key, which would usually be the `id` of another field.
- `tel_keyboard="true"`: Only accepts "true". Uses big numeric telephone keyboard on mobile devices.

#### Textarea

If fields are not indicated as required, they do not need to be included.

```html
{% include form-fields/_text-field.html
  id="first_name"                            //Needs to use underscores. Maps to name and id attributes. Required.
  label_text="Form label"                    //This is the label text. Required
  label_classes="class1 class2"              //Adds class names to the label
  optional="true"                            //Only accepts "true", makes form field optional
  hint="This is some hint text"              //Hint text under the label
  input_classes="class1 class2"              //Adds class names to the input
  prepopulate="session_storage_id"           //Used to add value of a key in session storage
%}
```

#### Checkbox

```html
{% include form-fields/_text-field.html
  name="checkbox_group"                      //Maps to name attribute. Required
  id="checkbox_1"                            //Needs to use underscores. Maps to id attribute. Required
  label_text="This is checkbox 1"            //This is the label text. Required
  label_classes="class1 class2"              //Adds class names to the label
  input_classes="class1 class2"              //Adds class names to the input
  checked="true"                             //Only accepts "true". Loads page with checkbox cheked.
%}
```

#### Radio

```html
{% include form-fields/_radio.html
  name="radio_group"                         //Maps to name attribute. Required
  id="radio_1"                               //Needs to use underscores. Maps to id attribute. Required
  label_text="This is radio 1"               //This is the label text. Required
  label_classes="class1 class2"              //Adds class names to the label
  input_classes="class1 class2"              //Adds class names to the input
  checked="true"                             //Only accepts "true". Loads page with checkbox cheked.
%}
```

#### Date

By default, dates are MM/DD/YYYY. The default legend text id Date of Birth

```html
{% include form-fields/_date.html
  id="todays_date"                             //Needs to use underscores. Maps to name and id. The include will add "_month", "_day", and "_year" to the name and id. Required
  label_text="Today's date"                    //Changes the text in the legend element
  hide="day"                                   //To exclude other fields. Accepts "day", "month, "year" or a combination such as "day month". Include can be updated for other fields.
  prepopulate="session_storage_id"             //Used to add value of another key in session storage. Do not include "_month", "_day", and "_year" from the sessionStorage key.
  min_year="YYYY"                              //Min year for validation. Example: "1900"
  max_year="YYYY"                              //Max year for validation. Example: "2019"
  optional="true"                              //Only accepts "true", makes form field optional
%}
```


#### List of states

Select box with all US states

```html
{% include form-fields/_state-select.html
  id="buyer_state"                           //Needs to use underscores. Maps to name and id attributes. Required
  label_text="Form label"                    //This is the label text. Otherwise will be "State"
  label_classes="class1 class2"              //Adds class names to the label
  optional="true"                            //Only accepts "true", makes form field optional
  input_classes="class1 class2"              //Adds class names to the input
  prepopulate="session_storage_id"           //Used to add value of a key in session storage devices
%}
```
