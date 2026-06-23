import { fetchUserProfile } from "@/app/actions/user.action";

const UserProfilePage = async ({ params }: { params: { id: string } }) => {
  const res = await fetchUserProfile(params.id);
  if (!res || res.statusCode !== 200 || !res.data) {
    return <div>Error loading user profile</div>;
  }
  const { user, orders } = res.data;

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <strong>Name:</strong> {user.name}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Phone:</strong> {user.phone || '-'}
      </div>
      <div style={{ marginTop: 20 }}>
        <h3>Order History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Order ID</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Restaurant</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Total</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>Order Time</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((o: any) => (
                <tr key={o._id}>
                  <td style={{ padding: '8px 4px' }}>{o._id}</td>
                  <td style={{ padding: '8px 4px' }}>{(o.restaurant && o.restaurant.name) || '-'}</td>
                  <td style={{ padding: '8px 4px' }}>{o.totalPrice?.toLocaleString() || '-'}</td>
                  <td style={{ padding: '8px 4px' }}>{o.status}</td>
                  <td style={{ padding: '8px 4px' }}>{new Date(o.orderTime).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: 12 }}>- No orders -</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserProfilePage;