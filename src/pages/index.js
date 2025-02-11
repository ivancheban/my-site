import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/default-docs/intro"
          >
            Start here
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const footerRef = useRef(null);

  useEffect(() => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: {
          enabled: true,
        },
        classes: 'shepherd-theme-dark',
        scrollTo: { behavior: 'smooth', block: 'center' },
      },
    });

    tour.addStep({
      title: 'This is the site title.',
      text: 'You can change it in docusaurus.config.js.',
      attachTo: { element: '.hero__title', on: 'bottom' },
      buttons: [
        {
          text: 'Next',
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      title: 'This is the site tagline.',
      text: 'You can change in docusaurus.config.js.',
      attachTo: { element: '.hero__subtitle', on: 'bottom' },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
        },
        {
          text: 'Next',
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      title: 'These are the site features',
      text: 'You can change them in src/components/HomepageFeatures.js.',
      attachTo: { element: '.features h3:first-child', on: 'bottom' },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
        },
        {
          text: 'Next',
          action: tour.next,
        },
      ],
    });

    tour.addStep({
      title: 'This is the site footer',
      text: 'You can change the footer items in docusaurus.config.js.',
      attachTo: { element: footerRef.current, on: 'top' },
      buttons: [
        {
          text: 'Back',
          action: tour.back,
        },
        {
          text: 'End Tour',
          action: tour.complete,
        },
      ],
    });

    tour.start();
  }, []);

  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
      <footer ref={footerRef}>
        {/* Your footer content goes here */}
      </footer>
    </Layout>
  );
}