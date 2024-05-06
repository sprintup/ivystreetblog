// app/resources/page.jsx
export default function Resources() {
  const resources = [
    {
      title: "Park Hill Library",
      link: "https://www.denverlibrary.org/content/park-hill-branch-library",
    },
    {
      title: "Diverse BookFinder",
      link: "https://diversebookfinder.org/",
    },
    {
      title: "Book Lists - Social Justice Books",
      link: "https://socialjusticebooks.org/booklists/",
    },
    {
      title: "Park Hill Community Bookstore",
      link: "https://www.parkhillbookstore.org/",
    },
    {
      title: "Reviews by Theme - Social Justice Books",
      link: "https://socialjusticebooks.org/reviews-by-theme/",
    },
    {
      title:
        "Guide for Selecting Anti-Bias Children's Books - Social Justice Books",
      link: "https://socialjusticebooks.org/guide-for-selecting-anti-bias-childrens-books/",
    },
    {
      title: "Sam Gary Library",
      link: "https://www.denverlibrary.org/sam-gary-branch-library",
    },
    {
      title: "Sam Gary Library - Idea Lab",
      link: "https://www.denverlibrary.org/idealab-samgary",
    },
    {
      title: "Denver Central Library",
      link: "https://www.denverlibrary.org/content/central-library",
    },
    {
      title: "Denver Public Library",
      link: "https://www.denverlibrary.org/",
    },
    {
      title: "ALSC Book & Media Awards - American Library Association",
      link: "https://www.ala.org/alsc/awardsgrants/bookmedia",
    },
    {
      title: "Caldecot Medal Recipients",
      link: "https://en.wikipedia.org/wiki/Caldecott_Medal#:~:text=Caldecott.%5B20%5D-,Recipients,-%5Bedit%5D",
    },
    {
      title: "Newbury Award Recipients",
      link: "https://en.wikipedia.org/wiki/Newbery_Medal#:~:text=publishing.%22%5B3%5D-,Recipients,-%5Bedit%5D",
    },
    {
      title: "Tattered Cover",
      link: "https://www.tatteredcover.com/",
    },
    {
      title: "Little Free Library Map",
      link: "https://littlefreelibrary.org/map/",
    },
    {
      title: "Media Literacy Now",
      link: "https://medialiteracynow.org/",
    },
    {
      title: "Dolly Parton's Imagination Library",
      link: "https://imaginationlibrary.com/letter-from-dolly/",
    },
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Resources</h1>
      <ul>
        {resources.map((resource, index) => (
          <li key={index} className="mb-2">
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow hover:text-orange focus:text-orange"
            >
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
