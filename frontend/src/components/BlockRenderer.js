import React, { useState, useEffect } from 'react';

const BlockRenderer = ({ blocks }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!blocks || !Array.isArray(blocks)) return null;
  
  // Prevent hydration mismatch by only rendering blocks on the client
  if (!mounted) return <div className="animate-pulse bg-gray-50 rounded-3xl h-64 w-full"></div>;

  return (
    <>
      {blocks.map((block, index) => {
        if (!block.blockName) return null;

        switch (block.blockName) {
          case 'core/paragraph':
            return (
              <p
                key={index}
                className="mb-8 text-xl text-gray-500 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: block.innerHTML }}
              />
            );

          case 'core/heading':
            const level = block.attrs?.level || 2;
            const Tag = `h${level}`;
            const headingClasses = {
              1: "text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-none italic uppercase animate-in fade-in slide-in-from-left duration-1000",
              2: "text-5xl font-black text-gray-900 mb-10 tracking-tight italic uppercase",
              3: "text-3xl font-black text-gray-900 mb-6 uppercase tracking-tight",
              4: "text-xl font-black text-gray-900 mb-4 uppercase tracking-widest",
            };
            return (
              <Tag
                key={index}
                className={headingClasses[level] || headingClasses[2]}
                dangerouslySetInnerHTML={{ __html: block.innerHTML }}
              />
            );

          case 'core/image':
            return (
              <figure key={index} className="my-12 animate-in fade-in zoom-in duration-700">
                <div 
                  className="rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
                  dangerouslySetInnerHTML={{ __html: block.innerHTML }} 
                />
                {block.attrs?.caption && (
                  <figcaption className="mt-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {block.attrs.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'core/cover':
            return (
              <section 
                key={index}
                className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-[4rem] mb-20 group"
              >
                <div className="absolute inset-0 z-0 transition-transform duration-1000 group-hover:scale-105">
                  <img 
                    src={block.attrs?.url} 
                    className="w-full h-full object-cover" 
                    alt={block.attrs?.alt || 'Cover image'}
                  />
                  <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 text-center px-6 max-w-4xl text-white">
                  <BlockRenderer blocks={block.innerBlocks} />
                </div>
              </section>
            );

          case 'core/group':
            return (
              <div key={index} className="py-20 animate-in fade-in duration-1000">
                <BlockRenderer blocks={block.innerBlocks} />
              </div>
            );

          case 'core/columns':
            const colCount = block.innerBlocks?.length || 1;
            return (
              <div 
                key={index} 
                className={`grid grid-cols-1 md:grid-cols-${colCount > 4 ? 4 : colCount} gap-12 my-20`}
              >
                <BlockRenderer blocks={block.innerBlocks} />
              </div>
            );

          case 'core/column':
            return (
              <div key={index} className="space-y-6">
                <BlockRenderer blocks={block.innerBlocks} />
              </div>
            );

          case 'core/button':
            return (
              <div key={index} className="my-8">
                <div 
                  className="[&_a]:bg-gray-900 [&_a]:text-white [&_a]:px-10 [&_a]:py-4 [&_a]:rounded-xl [&_a]:font-black [&_a]:uppercase [&_a]:tracking-widest [&_a]:text-sm [&_a]:transition-all [&_a]:shadow-lg [&_a:hover]:bg-green-600 [&_a:hover]:-translate-y-1 [&_a]:inline-block"
                  dangerouslySetInnerHTML={{ __html: block.innerHTML }} 
                />
              </div>
            );

          case 'core/list':
            return (
              <div
                key={index}
                className="my-8 pl-8 border-l-4 border-green-600 space-y-4 font-medium text-gray-600"
                dangerouslySetInnerHTML={{ __html: block.innerHTML }}
              />
            );

          case 'core/quote':
            return (
              <blockquote key={index} className="my-16 pl-12 border-l-[6px] border-green-600">
                <div className="text-3xl font-black text-gray-900 italic leading-tight mb-4">
                  <BlockRenderer blocks={block.innerBlocks} />
                </div>
              </blockquote>
            );

          default:
            return (
              <div
                key={index}
                className="wp-block-custom my-8"
                dangerouslySetInnerHTML={{ __html: block.innerHTML }}
              />
            );
        }
      })}
    </>
  );
};

export default BlockRenderer;
