import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Import the MultiBaas SDK dynamically on the server
    const MultiBaas = await import("@curvegrid/multibaas-sdk");
    const { isAxiosError } = await import("axios");

    const config = new MultiBaas.Configuration({
      basePath: body.basePath,
      accessToken: body.accessToken,
    });

    const contractsApi = new MultiBaas.ContractsApi(config);

    // Parse the args if they're provided as a string
    let args = body.args;
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch (e) {
        return NextResponse.json(
          { message: "Invalid JSON format for arguments" },
          { status: 400 }
        );
      }
    }

    const payload = {
      args: args,
      from: body.from,
    };

    try {
      const resp = await contractsApi.callContractFunction(
        body.chain,
        body.deployedAddressOrAlias,
        body.contractLabel,
        body.contractMethod,
        payload
      );

      return NextResponse.json({ result: resp.data.result });
    } catch (e) {
      if (isAxiosError(e)) {
        return NextResponse.json(
          {
            message: `MultiBaas error: ${
              e.response?.data?.message || e.message
            }`,
            status: e.response?.data?.status,
          },
          { status: e.response?.status || 500 }
        );
      } else {
        return NextResponse.json(
          { message: `An unexpected error occurred: ${(e as Error).message}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
