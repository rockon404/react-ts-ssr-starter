const template = (meta: string, html: string, styles: string, scripts: string, favicon: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      ${meta}
      ${favicon}
      ${styles}
    </head>
    <body>
      <div id="root">${html}</div>
    </body>
    ${scripts}
  </html>
`;

export default template;
