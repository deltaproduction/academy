import { Component }  from "react";
import Head           from "next/head";
import PropTypes      from "prop-types";
import { withRouter } from "next/router";

import { apiUrl }     from "@/lib/api";

class MetaHead extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    type: PropTypes.string,
    domain: PropTypes.string,
  }

  static defaultProps = {
    title: "Delta Academy",
    type: "page",
  }

  render() {
    const {title, description, image, type, domain, router} = this.props;
    const url = router && apiUrl(`${router.locale ? ('/' + router.locale) : ''}${router.asPath}`)
    return <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} key="og:title"/>
      <meta name="twitter:title" content={title} key="twitter:title"/>
      <meta property="og:type" content={type} key="og:type"/>
      {
        domain && <meta property="twitter:domain" content={domain}/>
      }
      {
        description && (<>
          <meta name="description" content={description} key="description"/>
          <meta property="og:description" content={description} key="og:description"/>
          <meta name="twitter:description" content={description} key="twitter:description"/>
        </>)
      }
      {
        image && (<>
          <meta name="twitter:card" content="summary_large_image" key="twitter:card"/>
          <meta property="og:image" content={image} key="og:image"/>
          <meta name="twitter:image" content={image} key="twitter:image"/>
        </>)
      }
      {
        url && (<>
          <meta property="og:url" content={url} key="og:url"/>
          <meta property="twitter:url" content={url} key="twitter:url"/>
        </>)
      }
    </Head>
  }
}

export default withRouter(MetaHead)
