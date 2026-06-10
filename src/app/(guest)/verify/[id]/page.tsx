import Verify from "@/components/auth/verify";

const verifyPage = ({ params }: { params: { id: string } }) => {
    const {id} = params;
    return (
        <>
            <Verify
                id = {id}
            />
        </>
    )
}

export default verifyPage;