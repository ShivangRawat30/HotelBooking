import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Airbnb } from "../target/types/airbnb";
import { Connection, PublicKey } from "@solana/web3.js";

describe("airbnb", () => {
  const date = "26/08/2024";
  const location = "Delhi";
  const country = "India";
  const price = "1200";
  const img = "https://pix10.agoda.net/hotelImages/42646912/0/64913132b6f62350244ac83823eaff4c.jpg?ce=0&s=702x392";
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.Airbnb as Program<Airbnb>;
  let [userAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("USER_STATE"), payer.publicKey.toBuffer()],
    program.programId
  )
  let [airbnbAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("AIRBNB_STATE"), payer.publicKey.toBuffer(), Buffer.from([0])],
    program.programId
  )
  let [bookingAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("BOOK_STATE"), payer.publicKey.toBuffer()],
    program.programId
  )

  it("Is initialized!", async () => {

    let [userAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("USER_STATE"), payer.publicKey.toBuffer()],
      program.programId
    )
    const tx = await program.methods.initializeUser().accounts({
      authority:payer.publicKey,
      userProfile:userAccount
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Air Bnb is Added", async() => {
    const tx = await program.methods.addAirbnb(
      location,
      country,
      price,
      img
    ).accounts({
      userProfile:userAccount,
      airbnbAccount: airbnbAccount,
      authority:payer.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Air Bnb is Updated", async() => {
    const tx = await program.methods.updateAirbnb(
      0,
      location,
      country,
      price,
      img
    ).accounts({
      userProfile:userAccount,
      airbnbAccount: airbnbAccount,
      authority:payer.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Air Bnb is Removed", async() => {
    const tx = await program.methods.removeAirbnb(
      0
    ).accounts({
      userProfile:userAccount,
      airbnbAccount: airbnbAccount,
      authority:payer.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Air Bnb is Booked", async() => {
    const tx = await program.methods.bookAirbnb(
      0,
      date,
      location,
      country,
      price,
      img
    ).accounts({
      userProfile:userAccount,
      bookingAccount: bookingAccount,
      authority:payer.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);
  });

  it("Air Bnb Booking is cancelled", async() => {
    const tx = await program.methods.cancelBooking(
      0
    ).accounts({
      userProfile:userAccount,
      bookingAccount: bookingAccount,
      authority:payer.publicKey,
    }).rpc();
    console.log("Your transaction signature", tx);
  });
});
