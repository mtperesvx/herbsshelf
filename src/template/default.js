const fs = require('fs')
const path = require('path')
const Header = require('./components/header')
const NavBar = require('./components/navBar')
const StepsCard = require('./components/stepsCard')
const RequestCard = require('./components/requestCard')
const ResponseCard = require('./components/responseCard')

const getCssStyle = () => {
	const cssFilePath = path.resolve(__dirname, '../css/shelf.css')
	return fs.readFileSync(cssFilePath, 'utf-8')
}

const getReadme = (path) => {
	if (fs.existsSync(path)) {
		const readme = fs
			.readFileSync(path)
			.toString()

		return encodeURI(readme.replace('\'',''))
	}

	return ''
}

function generateHTML(project, shelfData, readmePath) {
	let template = `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
	      <meta charset="UTF-8" />
	      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
	      <title>Herbs Shelf</title>
	  </head>
	  <style>
	    ${getCssStyle()}
	  </style>
	  <body>
	    ${Header}

	    <main id="shelf"/>

	    <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
	    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
	    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
		<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>


	    <script type="text/babel">
	      const { useState } = React
	      function Shelf() {			
			const [readmeText, setReadmeText] = useState('${getReadme(readmePath)}');
	        const [page, setPage] = useState(-1);
	        const [navOpen, setNavOpen] = useState(-1);
	        const [selectedPage, setSelectedPage] = useState({});
	        const [shelfData, setShelfData] = useState(${JSON.stringify(shelfData)});

	        const openNav = (value) => {
	          setNavOpen(navOpen === value ? -1 : value)
	          setPage(-1)
	          forceUpdate()
	        }

	        const openPage = (value) => {
	          const selectedPage = page === value ? -1 : value
	          setPage(selectedPage)
	          if(selectedPage !== -1) setSelectedPage(shelfData[navOpen].useCases[selectedPage])
	          forceUpdate()
	        }

			const StartedProject = () => {
				return (
					<section className="content">
						<h2>Getting started!</h2>
						<p>This is a self-generate documentation, here you can see all the flow of information in the application.</p>
						<p>You can use the lateral panel to navigate into <strong>Use Cases</strong> of this application.</p>
					</section>
				)
			}

			const ReadmeDoc = () => {
				return (
					<section className="content">
						<article dangerouslySetInnerHTML={{__html: marked(decodeURI(readmeText)) }}></article>
				  	</section>
				)
			}

			const WelcomeProject = () => readmeText ? <ReadmeDoc /> : <StartedProject /> 

	        return (
	          <main id="shelf">
	            ${NavBar(project)}
	            {page < 0 ? <WelcomeProject />
	            :
                <section className="content">
                  <h3>{selectedPage.description}</h3>
                  ${StepsCard}
                  <div class="content-row">
                    ${RequestCard}
                    ${ResponseCard}
                  </div>
                </section>
	            }
	          </main>
	        );
	      }
	      const domContainer = document.querySelector('#shelf');
	      ReactDOM.render(<Shelf />, domContainer);
	      </script>
	    </body>
	  </html>`
	return template
}
module.exports = generateHTML
