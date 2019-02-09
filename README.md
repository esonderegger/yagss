# yagss
Yet another generator for static sites

## Quickstart

```
npx create-yagss-site my-new-site
cd my-new-site
npm install
npm run start
```

## Configuration options

- `site_url`: The base url where this site will be hosted. Necessary for `meta` tags like `canonical` and social sharing tags.
- `title`: A default value for page title if none is provided
- `description`: A default value for page description if none is provided
- `src_dir`: location for site content pre-transpilation and pre-transcoding
- `dest_dir`: location for converted site assets, used for local development and for deployment
- `templates_dir`: location for "server-side" templates, 
- `cache_dir`: location for storing files to make site-building faster
- `scss_file`: It is recommended to have a single file used for site-wide global styles. 
- `css_file`: (deprecated) in future versions this should be determined by the `scss_file` value
- `social_image`: default value for facebook/twitter meta tags if none is provided
- `img_sizes`: array of integers for image widths jpg source files should be converted to
