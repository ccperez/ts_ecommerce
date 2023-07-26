import Chart from 'react-google-charts';
import { Helmet } from 'react-helmet-async'
import { Card, Col, Row } from 'react-bootstrap'

import Loading from '../../components/Loading'
import Message from '../../components/Message'

import { getError } from '../../utils'
import { ApiError } from '../../types/ApiError'
import { useGetOrderSummaryQuery } from '../../hooks/orderHooks'

export default function DashboardPage() {

  const { data: summary, isLoading, error } = useGetOrderSummaryQuery()

  const DashboardItem = ({ title, text }: { title: string, text: string }) =>
    <Col md="4">
      <Card>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>{text}</Card.Text>
        </Card.Body>
      </Card>
    </Col>

  return (
    <div>
      <Helmet>
        <title>
          Dashboard
        </title>
      </Helmet>
      <h1>Dashboard</h1>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{getError(error as ApiError)}</Message>
      ) : (
        <>
          <Row>
            <DashboardItem
              title={`${summary?.users[0]?.numUsers || 0}`}
              text=" Users"
            />
            <DashboardItem
              title={`${summary?.orders[0]?.numOrders || 0}`}
              text=" Orders"
            />
            <DashboardItem
              title={`$ ${summary?.orders[0]?.totalSales.toFixed(2) || 0}`}
              text=" Total Sales"
            />
          </Row>
          <div className="my-3">
            <h2>Sales</h2>
            {summary?.dailyOrders?.length ? (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              />
            ) : (
              <Message variant="warning">No Sale</Message>
            )}
          </div>
          <div className="my-3">
            <h2>Categories</h2>
            {summary?.productCategories?.length ? (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              />
            ) : (
              <Message variant="warning">No Category</Message>
            )}
          </div>
        </>
      )}
    </div>
  )
}
