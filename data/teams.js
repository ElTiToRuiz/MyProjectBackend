function generateTeamNameAndDescription() {
    const categories = {
        "marketing": {
            teamNames: ["Ad Avengers", "Promo Pros", "Brand Builders", "Campaign Crusaders", "Click Conquerors"],
            descriptions: [
                "Focuses on creating high-impact marketing campaigns and promotions.",
                "Dedicated to enhancing brand visibility and engagement.",
                "Masters of driving traffic and conversions.",
                "Innovators in campaign strategies and user engagement.",
                "Experts in performance-based marketing tactics."
            ]
        },
        "sales": {
            teamNames: ["Revenue Runners", "Deal Closers", "Quota Crushers", "Lead Legends", "Conversion Kings"],
            descriptions: [
                "Works to convert leads into loyal customers.",
                "Dedicated to meeting sales goals and targets.",
                "Always on the hunt for new opportunities to drive revenue.",
                "Specialists in closing high-value deals.",
                "Focused on building long-lasting customer relationships."
            ]
        },
        "support": {
            teamNames: ["Help Heroes", "Solution Squad", "Support Squad", "Customer Champions", "Query Crushers"],
            descriptions: [
                "Committed to providing excellent customer service and support.",
                "Works to resolve issues and answer queries quickly and effectively.",
                "Always ready to assist customers and solve their problems.",
                "Focused on ensuring customers have a seamless experience.",
                "Experts in customer relations and troubleshooting."
            ]
        },
        "product": {
            teamNames: ["Feature Finders", "Dev Masters", "Innovation Hub", "Product Pioneers", "Tech Trailblazers"],
            descriptions: [
                "Responsible for driving product innovation and development.",
                "Focused on designing and improving user experience and features.",
                "Always working to make the product better for users.",
                "Experts in turning customer feedback into actionable product features.",
                "Dedicated to building and refining the product to perfection."
            ]
        }
    };

    const category = getRandomItem(Object.keys(categories));
    const teamName = getRandomItem(categories[category].teamNames);
    const teamDescription = getRandomItem(categories[category].descriptions);

    return { name: teamName, description: teamDescription };
}

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

export const TEAMS = Array.from({ length: 5 }, () => generateTeamNameAndDescription());
