import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import SectionRenderer from '../components/SectionRenderer';

const DynamicPage = ({ page, settings }) => {
  if (!page) return null;

  return (
    <Layout>
      <Head>
        <title>{`${page.title} | ${settings?.siteTitle || 'PawFresh'}`}</title>
        <meta name="description" content={settings?.siteTagline} />
      </Head>

      <main className="min-h-screen bg-white">
        <SectionRenderer sections={page.sections} settings={settings} />
      </main>
    </Layout>
  );
};

export async function getStaticPaths() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/headless/v1/site`);
    const data = await res.json();

    const paths = data.pages
      .filter(page => page.slug !== 'home')
      .map(page => ({
        params: { slug: page.slug.split('/') },
      }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching paths:', error);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const slug = params.slug.join('/');

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/headless/v1/site`);
    const data = await res.json();

    const page = data.pages.find(p => p.slug === slug);

    if (!page) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        page,
        settings: data.settings,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      notFound: true,
    };
  }
}

export default DynamicPage;
