# The Brown University Band’s website

Welcome to the repository for the Brown Band!

TODO:

- [ ] figure out what to do with `_redirects`

## Documentation

(this whole thing is probably somewhat out of date, so if you see any issues please correct them)

### Getting Started

This site is a static site powered by [Eleventy (11ty)](https://www.11ty.dev) and hosted on [TBD]. That means that the files in this repository are transformed by a build script producing a folder full of plain HTML files that any static site host can serve.

To get started, make sure you have [Node.js](https://nodejs.org/en/) installed. I recommend using something like [nvm](https://github.com/nvm-sh/nvm) (or my favorite, [asdf](https://asdf-vm.com)), which will automatically pick up the `.node-version` file in this repo and prompt you to install that version of Node.

In a terminal, run `npm install` from this project’s directory to install most dependencies. You can run one of several scripts via `npm run`:

- <code>npm run **start**</code> (or `npm start` for short): Runs Eleventy in development mode, starting a local server and rebuilding whenever you change a file. Open https://localhost:8080 to view the website locally!
- <code>npm run **build**</code>: Runs Eleventy once, outputting the generated site in the `public` folder. Run this before uploading the contents of that folder to a static site host. (There’s typically no need for you to do this, since a new build will be automatically triggered whenever you push updated code to GitHub)
- <code>npm run **format**</code>: Runs [Prettier](https://prettier.io) to ensure consistent code and document formatting. Ideally, set up your code editor to run Prettier whenever you save a file — check out their [editor integration docs](https://prettier.io/docs/en/editors.html) or search your editor’s package manager for a “Prettier” package.
- <code>npm run **start:book**</code> and <code>npm run **build:book**</code>: like `npm start` and `npm run build` but for the script book. See below!

(Note: I put the current LTS version of Node.js into the `.node-version` file — feel free to update it at any time (after checking to make sure the new version still works right!))

### File organization

- `assets`: miscellaneous static files (i.e. images, JS, CSS, and anything else that you need that isn’t a page)
- `book`: handles printing the script books given to seniors at graduation
- `book-html`: the output directory for `npm run book:*`, not checked into Git.
- `buttons`: contains folders for each class year. See below for more detailed instructions.
  - `buttons/*/labels.yml`: contains a mapping from college name → button description
- `config`: things that make Eleventy work the way we want. Includes functionality common to both the book and the website.
  - `index.js`: various config things. If you’re adding new config, consider putting it here unless it only applies to the website (i.e. not the book)
  - `remark-directives.mjs`: [remark](https://remark.js.org) plugin for handling custom syntax used in scripts
  - `script.js`: Creates collections of the scripts for every semester (used to render the script pages) and a list of those collections (used to render the scripts homepage).
- `data`: contains a combination of static data (`.yml` files) and scripts that produce the relevant data for the website (`.js` files)
  - `people/*.yml`: lists the section leaders, appointed positions, conductors, and members of band board.
  - `buttons.js`: scans the `buttons` folder and formats the buttons for display on the buttons page
  - `eleventyComputed.js`: (in order)
    - identifies the opponent (who?) in all of our scripts
    - handles automatically creating titles for pages that don’t specify them. (it might do other things too if this section is out of date, go check!)
    - figures out the right semesters to include in the book
  - `nav.yml`: contains the data for the nav bar
  - `quote.js`: selects the random quote displayed on the site header
  - `schoolColors.yml`: Contains the primary color used by most/all of the schools we’ve played in the past. The `color` property is used by the buttons page to tint the table headers and the script renderer to color the college names in the script titles. The `type` property is used to help split the buttons page into categories.
  - `site.yml`: global metadata for the website (currently just the title)
  - `specialButtons.yml`: list of buttons that don’t fit into any of the existing categories
- `includes`: can be imported using `{% include %}`
  - (note: included templates use the same output language as the page that includes them)
  - `button-table.njk`: code for rendering the tables on the button page
  - `footer.html`: contains the page footer
  - `icons.html`: contains various SVG icons used on the website (as of this writing, only in the footer)
  - `nav.njk`: renders the navbar, and is responsible for highlighting the active item
  - `people-table.md`: used to make the section leader and appointed position tables
  - `person.md`: used to display band board and conductor bios
  - `script.njk`: displays the metadata and content for a single show script
- `layouts`
  - `base.njk`: contains the basic page layout (shared across print and web), including the page title, CSS/JS imports, and page content
  - `web.njk`: contains the navbar and `container` (which sets the maximum width of the content) (inherits `base.njk`)
  - `page.njk`: renders the page title and summary (inherits `web.njk`)
- `pages`: the pages on the website. Each page is automatically compiled into HTML by Eleventy.
  - `scripts`: show scripts. Contains a subfolder for each year’s scripts, with `fall` and `spring` subfolders.
  - `index.md`: the homepage
- `public`: the output directory, not checked into Git.
- `eleventy.config.js`, `eleventy-book.config.js`: configuration file for Eleventy. See docs inside the file for more details.
- `jsconfig.json`: used to configure TypeScript language features for editor integration (we’re not actually using TypeScript at this point, but the autocomplete it provides is sometimes helpful)

### Common Tasks

#### Updating Leadership

To update the people page, edit the files in `data/people/`.

For band board and the conductors, provide the following properties:

- `position`:
  - this does not need to be updated when the person in the position changes
  - for band board: an object with these properties
    - `name`: the name of the position
    - `sec`: the section of the constitution that creates this position
    - `role`: a sentence describing the role of this position
  - for conductors: just a string containing the name of the position
- `name`: full name
- `email`: email
- `link`: apostrophe link provided by the person
- `year` graduation year (2 digits, represented as a number)
  - If you’re seeing unexpected behavior because people are graduating on or after 2100, I’m sorry. (actually I’m probably dead and therefore not capable of being sorry)
- `bio`: bio provided by the person. Uses a YAML [“literal block scalar”](https://web.archive.org/web/20211119210045/https://yaml-multiline.info) to preserve newlines. Make sure to keep the `|` after the `:`, and start the bio on the next line.

For section leaders and appointed positions, provide the following properties:

- `name`: the name of the position.
- `people`: a list of objects with these properties:
  - `name`: the person’s full name
  - `email`: their email
  - `year`: their graduation year (2 digits, represented as a number). See disclaimer above about this property

#### Adding Buttons

First, save a lossless copy of the button image for posterity (do **not** convert this back from the `.jpg`, instead make sure you get a `.png` or vector graphic file from the corsec)

1. In the `band-media` repository, create a new folder inside `buttons` with the current year, i.e. `2031-2032`
2. Add `.png` files for each button to that folder, with lowercased names. Replace spaces in the name with dashes.

Next, back in this repo:

1. Create a new folder inside `buttons` with the current year, i.e. `2031-2032`
2. Convert the button images from above to `.jpg` and add them to the new folder, with the same naming convention as the `.png` files above.
   - I (Jed) used 80% quality for my conversions, but feel free to pick an appropriate value!
   - This is done because JPEGs are significantly (~90%) smaller than the original PNGs. Git is annoying to use with huge files, so I leave that issue for the (hopefully less-frequently-updated) media repo. Feel free to swap out the JPEGs for whatever fancy new format the people from your time have cooked up! Just make sure you encode from the original PNGs rather than re-encoding the JPEGs.
3. Create a `labels.yml` file inside that folder.
   - Use the following format for each line: <code>_College Name (with proper spaces and capitalization)_: _Description on Button_</code>
   - For the description, include any text on the button. For graphic elements (such as images), enclose a brief description of the graphic in braces (`{}`). If the description starts with a brace or a quote, make sure you wrap it in quotes so YAML handles it properly.
   - Look at old buttons for examples of how to write the description!

That’s it! The build script will automatically pick up the new buttons and add them to the buttons page.

#### Adding Scripts

1. Create a new folder for the current semester (in `pages/scripts`, following existing patterns) if necessary
2. Create a new `.md` file for the script, with the name based on either the opponent or the name of the event (check previous scripts for inspiration)
3. In the script file, add a front matter section with the following information:
   - `sport`: the type of sport — either `football` or `hockey`. Leave this out if the script is for a non-sports-game event.
   - `teams`: the teams at the sports game. Again, leave this out for non-sports scripts. An object with two keys:
     - `home`: the team that was at home (if it was a home game for us, that will be Brown; otherwise, it will be the opponent)
     - `away`: the other team (i.e. the one that that was the away team for this game)
     - each team should be an object with these two keys:
       - `name`: The human-readable name of the college/university (usually abbreviated), e.g. `Harvard`, `Penn`, `Holy Cross`
       - `score` (optional): the score that team had at the end of the game. This can usually be found online pretty easily. But if not, just leave it off.
   - sometimes, you won’t know the score or whether we were home or away (this applies more to historical games than ones from the present). In that case, specify an `opponent` key instead of `teams`, and just give the name of the opponent (e.g. `opponent: Princeton`)
   - `title`: if the event is unusual in some way, set a custom title.
   - `date`: this is _very required_ and the site will not build without it. Specify the date the event occurred on. Feel free to guess for historical events if necessary, but make sure you leave a comment (`# ....`) above the date describing your rationale so it doesn’t get treated as authoritative.

#### Compiling senior script books

1. In `eleventy-book.config.js`, update `graduationYear` (to the desired graduation year, with a .5 if the book is for a .5er) and `extraYear` (to `true` if you’re making it for someone who took an extra year, `false` otherwise)
2. Run `npm run build:book`, then open `book/book.pdf` in your favorite PDF viewer. Expect it to be around 100 pages.
3. Make sure there are no typos and everything is laid out decently, then…
   - If you have to make changes, run `npm run start:book` and open http://localhost:8080 in your browser to get a live preview of what the book will look like. Note that you will have to manually refresh to get CSS changes to apply, due to the way the paging library works.
4. [TODO: fill out this step once I figure out how to print it out]

#### Adding/removing pages

1. Create a new `.md` file in the `pages` folder. The name of the file will be the URL (i.e. `about-us.md` is `/about-us`).
   - The title will be automatically created from the name of the file by replacing dashes with spaces and title-casing. If this behavior is incorrect, specify the `title` property in the front matter (front matter is described below)
   - Use the `.html` extension if you want to write HTML instead of Markdown.
2. (optional) Add [front matter](https://www.11ty.dev/docs/data-frontmatter/) (three dashes on a line, followed by some YAML, followed by three more dashes on a line, followed by the actual content of the file). You can specify any data here, but currently the website supports:
   - `title`: A custom title for the page. By default, it will be generated from the file name, so in most cases you won’t need to manually specify it.
     - if the default title is only wrong due to mis-capitalizing an acronym or similar, add the correct capitalization to the `special` array at the end of the `title` function in `eleventyComputed.js` and it will be used instead.
   - `layout`: defaults to `page.njk` (i.e. `layouts/page.njk`). Specify a different layout if you want.
   - `summary`: italicized, indented text displayed between the title and the content
   - `css`: specify an array of CSS files (without the extension, from `assets/css/`) to add to the current page.
   - `show_header`: disable the default header. for when you want a something custom
   - (there are a bunch more for scripts, described below)
   - check out [Eleventy’s docs](https://www.11ty.dev/docs/data-configuration/) for additional options.
3. Add the page content, formatted using Markdown. You can use [Nunjucks template commands](https://mozilla.github.io/nunjucks/templating.html) to incorporate data into the page.
4. Add the page to the navbar:
   - To add it at the top level, edit `nav.njk` to add a link to the page (use the “Contact” link as an example)
   - To add it to a menu, edit `nav.yml` by adding an entry somewhere with the path of the page (without the file extension; use the others as an example). The title will be automatically picked up.

---

### Why Eleventy?

I (Jed) chose Eleventy for several reasons.

- I hadn’t used it before and wanted to try something new
- I like JavaScript and am comfortable writing it
- Eleventy is a few years old but still quite modern and actively maintained
- Very little of the content of this repo is actually specific to Eleventy.
  - Most static site generators have a concept of front matter, data files, layouts, includes, and assets.
  - The templates are written in a popular template language (Nunjucks), which is quite similar to Liquid (used by Jekyll and others) and Handlebars.
- Unlike static site generators that offer framework integration (Gatsby, Next.js, Nuxt, …), Eleventy does not impose any requirements or restrictions on the frontend.
  - For what the band site does now, plain old static HTML with a little vanilla JS sprinkled on top is perfectly adequate.
  - I built a site with Gatsby once and it is so unnecessarily complicated. Most of the code in this repo is about making a site for the band, not appeasing the framework.
- The previous website was built with Drupal. PHP bad.

One downside of Eleventy is that, because it’s code-based with no graphical editor, it is less accessible to people with no coding background. However, Markdown is becoming more and more common, and I doubt the band will have a shortage of CS students anytime soon.

While I think I’ve made a sound technical decision in late 2021, I’m not naïve enough to believe that Eleventy will always be the best option. Use your own judgement! Hopefully the work I put into converting the various pieces of historical data into a reasonable format will make it reasonably easy to switch over to a new platform/framework. If the website just needs a fresh coat of paint, you can rewrite `layouts` and `includes` (and throw out Bootstrap if you want) while still keeping Eleventy around.

If you ever get really stuck with something, you can always [reach out to me](mailto:jed@jedfox.com) and I’ll do my best to lend a hand!
