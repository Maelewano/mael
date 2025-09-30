export interface TeamMember {
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    linkedinUrl: string;
}

export const teamMembers: TeamMember[] = [
    {
        name: "Primus C Kabuo",
        title: "Lead Developer - Mael",
        bio: "Research Software Engineer",
        imageUrl: "/images/team/primus.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/chimdia-primus-kabuo/",
    },
    {
        name: "Michael K Nwokocha",
        title: "Developer & Tester - Mael",
        bio: "Full Stack Developer",
        imageUrl: "/images/team/micheal.jpeg",
        linkedinUrl: "https://www.linkedin.com/in/kesiride-nwokocha-78a30959/",
    }
];