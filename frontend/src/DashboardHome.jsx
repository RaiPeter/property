import Card from "./components/Card";
import "./DashboardHome.css"
import PropertyIcon from "./assets/property1.png"
import AgentIcon from "./assets/agents1.png"
import CustomersIcon from "./assets/customers1.png"
import RevenueIcon from "./assets/revenue.png"
import StackedBarChart from "./components/StackedBarChart";
import RevenueCard from "./components/RevenueCard";
import Table from "./components/Table";
const data = [
    {
      id: 1,
      orders: 'Jaime Wallace',
      date: '2024-02-01',
      property_type: "residential",
      property_name: 'Peru',
      status: 'paid',
      price: '1,234,234'
    },
    {
      id: 2,
      orders: 'Sophia Carter',
      date: '2023-11-15',
      property_type: "commercial",
      property_name: 'Brazil',
      status: 'cancelled',
      price: '875,320'
    },
    {
      id: 3,
      orders: 'Liam Johnson',
      date: '2024-01-20',
      property_type: "commercial",
      property_name: 'Mexico',
      status: 'paid',
      price: '2,450,000'
    },
    {
      id: 4,
      orders: 'Olivia Brown',
      date: '2023-12-05',
      property_type: "commercial",
      property_name: 'Argentina',
      status: 'cancelled',
      price: '560,780'
    },
    {
      id: 5,
      orders: 'Noah Williams',
      date: '2024-02-10',
      property_type: "residential",
      property_name: 'Chile',
      status: 'paid',
      price: '3,145,890'
    },
    {
      id: 6,
      orders: 'Emma Davis',
      date: '2023-10-30',
      property_type: "residential",
      property_name: 'Colombia',
      status: 'paid',
      price: '1,780,300'
    },
    {
      id: 7,
      orders: 'James Martinez',
      date: '2024-01-12',
      property_type: "commercial",
      property_name: 'Ecuador',
      status: 'paid',
      price: '920,450'
    },
    {
      id: 8,
      orders: 'Ava Taylor',
      date: '2023-09-22',
      property_type: "residential",
      property_name: 'Uruguay',
      status: 'cancelled',
      price: '645,210'
    },
    {
      id: 9,
      orders: 'William Anderson',
      date: '2024-02-05',
      property_type: "commercial",
      property_name: 'Paraguay',
      status: 'cancelled',
      price: '4,200,500'
    },
    {
      id: 10,
      orders: 'Isabella Thomas',
      date: '2023-11-28',
      property_type: "residential",
      property_name: 'Bolivia',
      status: 'paid',
      price: '2,750,630'
    }
  ];
    


export default function DashboardHome(){

    return (
        <div className="dashboard-layout">
            <div className="dashboard-cards">
                <Card name="No. of properties" amount="5467" update="-3.27" imgSrc={PropertyIcon}/>
                <Card name="Regi. Agents" amount="607" update="+5.53" imgSrc={AgentIcon}/>
                <Card name="Customers" amount="5467" update="-2.33" imgSrc={CustomersIcon}/>
                <Card name="Revenue" amount="5467" update="+4.25" imgSrc={RevenueIcon}/>
            </div>
            <div className="dashboard-chart">
                <StackedBarChart/>
                <RevenueCard />
            </div>
            <div className="dashboard-table">
                <Table rows={data} />
            </div>
        </div>
    )
}