<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="frontend/public/Unibersidad_ng_Pilipinas_Mindanao.png" alt="UP Mindanao Logo" width="80" height="80">
  </a>

<h3 align="center">UPMin-GPO System</h3>

  <p align="center">
    University of the Philippines Mindanao — Graduate Programs Office System
    <br />
    <a href="https://github.com/[PLACEHOLDER_USER]/UPmin-GPO"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/[PLACEHOLDER_USER]/UPmin-GPO">View Demo</a>
    ·
    <a href="https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/issues">Report Bug</a>
    ·
    <a href="https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

The **UPMin-GPO System** is a dedicated web-based platform designed to digitize and streamline the operations of the Graduate Programs Office (GPO) at the University of the Philippines Mindanao. As a constituent university of the UP System, UP Mindanao is committed to academic excellence and administrative efficiency.

This system serves as a central hub for:

* **Graduate Admissions & Applications:** Digital processing of program applications, qualifications, and requirements.
* **Curriculum & Study Plans:** Managing degree programs, course pools, and individual study plans for master's and doctoral students.
* **Faculty & Academic Records:** Maintaining faculty credentials and their associations with various graduate programs.
* **Information Dissemination:** Centralized portal for announcements, scholarship opportunities, and office history/vision.
* **Student Success Tracking:** Managing alumni testimonies and thesis/dissertation milestones (Roadmap).

By transitioning from manual processes to a unified digital environment, the GPO can better serve its students, faculty, and administrative staff, ensuring that the graduate education experience at UP Mindanao remains world-class.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

The UPMin-GPO system is built using a modern full-stack JavaScript/TypeScript architecture to ensure scalability and performance.

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Express][Express.js]][Express-url]
* [![Prisma][Prisma]][Prisma-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![Tailwind][TailwindCSS]][Tailwind-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm

  ```sh
  npm install npm@latest -g
  ```

* PostgreSQL database instance

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/[PLACEHOLDER_USER]/UPmin-GPO.git
   ```

2. **Setup Backend**

   ```sh
   cd backend
   npm install
   ```

   * Create a `.env` file in the `backend` directory:

     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/upmin_gpo"
     JWT_SECRET="[PLACEHOLDER_SECRET]"
     ```

   * Run Prisma migrations and seed the database:

     ```sh
     npx prisma migrate dev
     node prisma/seed.js
     ```

3. **Setup Frontend**

   ```sh
   cd ../frontend
   npm install
   ```

   * Create a `.env.local` file in the `frontend` directory:

     ```env
     NEXT_PUBLIC_API_URL="http://localhost:3001/api"
     ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

The system is divided into a public-facing portal and an administrative dashboard.

* **Public Portal:** Prospective and current students can view program offerings, application requirements, scholarships, and latest announcements.
* **Admin Dashboard:** Authorized GPO staff can manage programs, update faculty records, post announcements, and review application entries.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

* [ ] Thesis and Dissertation Tracking Module
* [ ] Automated Enrollment Integration
* [ ] Inter-office Document Routing
* [ ] Multi-language Support (English/Cebuano)
* [ ] Enhanced Analytics Dashboard for Program Directors

See the [open issues](https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

**UP Mindanao Graduate Programs Office**
Email: [PLACEHOLDER]@up.edu.ph
Website: [https://www2.upmin.edu.ph/](https://www2.upmin.edu.ph/)

Project Link: [https://github.com/[PLACEHOLDER_USER]/UPmin-GPO](https://github.com/[PLACEHOLDER_USER]/UPmin-GPO)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [University of the Philippines Mindanao](https://www.upmin.edu.ph/)
* [UP Mindanao Office of the Chancellor](https://www.upmin.edu.ph/office-of-the-chancellor)
* [UP System Information Technology Foundation (UPSITF)](https://upsitf.org/)
* [GitHub Emoji Cheat Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)
* [Img Shields](https://shields.io)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/[PLACEHOLDER_USER]/UPmin-GPO.svg?style=for-the-badge
[contributors-url]: https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/[PLACEHOLDER_USER]/UPmin-GPO.svg?style=for-the-badge
[forks-url]: https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/network/members
[stars-shield]: https://img.shields.io/github/stars/[PLACEHOLDER_USER]/UPmin-GPO.svg?style=for-the-badge
[stars-url]: https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/stargazers
[issues-shield]: https://img.shields.io/github/issues/[PLACEHOLDER_USER]/UPmin-GPO.svg?style=for-the-badge
[issues-url]: https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/issues
[license-shield]: https://img.shields.io/github/license/[PLACEHOLDER_USER]/UPmin-GPO.svg?style=for-the-badge
[license-url]: https://github.com/[PLACEHOLDER_USER]/UPmin-GPO/blob/master/LICENSE.txt
[product-screenshot]: https://via.placeholder.com/800x400?text=UPMin-GPO+System+Dashboard
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
