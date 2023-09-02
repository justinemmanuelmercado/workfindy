import { printToHtmlAndTruncate, toRelativeDate } from '../common';
import Layout from '../layouts/Layout.astro';
import Filters from '../components/Filters.astro';
import Pagination from '../components/Pagination.astro';
import { sources, sourcesQuery, notices, noticesCount, page, limit } from './index.astro';

<Fragment>
<Layout title="WorkFindy | Remote Work Job List">
<div class="flex flex-col lg:flex-row h-screen w-full min-w-[320px] m-auto">
<section class="bg-gray-100 border-b border-r border-neutral-950 sticky top-0 lg:h-screen">
<span class="flex justify-between lg:justify-center p-4">
<span class="w-20 text-primary-200 flex items-center justify-center">
<img src="./logo.svg" alt="" />
</span>

<label class="w-8 text-neutral-100 flex justify-center lg:hidden" for="filter-menu">
<img src="./menu.svg" alt="" />
</label>
</span>
<div class="hidden lg:block space-y-8 px-2">
<Filters sources={sources} sourcesQuery={sourcesQuery} />
</div>
</section>
<input type="checkbox" class="peer hidden" id="filter-menu" />

{/** Because of a bug with Astro, and css where the animation plays on page load, I will re-add animations when inlining gets added.  */}
<div class="hidden fixed top-0 z-40 h-full w-full overflow-y-auto overscroll-y-none peer-checked:flex">
<label for="filter-menu" class="w-1/5 h-full opacity-80 bg-gray-100 block"></label>
<div class="w-4/5 p-4 bg-gray-500 border-l border-neutral-700">
<label class="lg:hidden" for="filter-menu">
<img class="w-12" src="./close.svg" alt="Close menu button" />
</label>
<span class="block pt-2 space-y-8">
<Filters sources={sources} sourcesQuery={sourcesQuery} />
</span>
</div>
</div>
<section class="flex flex-col w-full max-h-screen overflow-y-auto relative space-y-2 bg-neutral-950">
<div class="p-4 space-y-2">
{notices.map((notice, i) => {
const bg = i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-300';
return (
<Fragment><div class={`flex flex-col p-4 rounded-xl ${bg} shadow-sm hover:border-neutral-500 border border-neutral-900 space-y-1 md:p-4`}>
<a href={`/${notice.id}`}>
<p class="font-bold">{printToHtml(notice.title)}</p>

<p class="hidden md:block">{printToHtmlAndTruncate(notice.body, 150)}</p>
<p class="text-xs font-extralight">{toRelativeDate(notice.publishedDate)}</p>
</a>
<p class="text-xs font-extralight hover:text-primary-200">
<a class="underline" href={notice.source.homepage}>
From {notice.source.name}
</a>
</p>
<hr />
<div class="flex justify-end">
<a class="block w-full md:w-fit" href={notice.url}>
<button class="border border-primary-200 rounded-xl py-2 px-8 md:px-5 w-full font-bold text-primary-200">
Apply
</button>
</a>
</div>
</div></Fragment>
);
})}
</div>
<Pagination noticesCount={noticesCount} page={page} sourcesQuery={sourcesQuery} limit={limit} />
</section>
</div>
</Layout>

</Fragment>;