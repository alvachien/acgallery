using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System.Diagnostics;
using System.IO;

namespace acgallery
{
    public struct ExifTagItem
    {
        public string group;
        public string name;
        public string value;
    }

    public class ExifToolWrapper : List<ExifTagItem>
    {
        #region public methods
        public bool CheckToolExists()
        {
            string toolPath = GetAppPath();
            toolPath += "/exiftool.exe ";
            toolPath += "-ver";

            string output = "";
            if (!File.Exists("ExifTool.exe"))
            {
                return false;
            }
            else
            {
                //try
                //{
                //    output = Open(toolPath);
                //}
                //catch (Exception)
                //{
                //}
            }
            // check the output
            if (output.Length < 4)
                return false;

            // (could check version number here if you care)
            return true;
        }

        public void Run(string filename, bool removeWhitespaceInTagNames = false)
        {
            // exiftool command
            string toolPath = GetAppPath();
            toolPath += "/exiftool.exe ";
            string argStr = "";
            if (removeWhitespaceInTagNames)
                argStr += " -s ";
            argStr += " -fast -G -t -m -q -q ";
            argStr += "\"" + filename + "\"";

            string output = Open(toolPath, argStr);

            // parse the output into tags
            this.Clear();
            try
            {
                while (output.Length > 0)
                {
                    int epos = output.IndexOf('\r');

                    if (epos < 0)
                        epos = output.Length;
                    string tmp = output.Substring(0, epos);
                    int tpos1 = tmp.IndexOf('\t');
                    int tpos2 = tmp.IndexOf('\t', tpos1 + 1);

                    if (tpos1 > 0 && tpos2 > 0)
                    {
                        string taggroup = tmp.Substring(0, tpos1);
                        ++tpos1;
                        string tagname = tmp.Substring(tpos1, tpos2 - tpos1);
                        ++tpos2;
                        string tagvalue = tmp.Substring(tpos2, tmp.Length - tpos2);

                        // special processing for tags with binary data 
                        tpos1 = tagvalue.IndexOf(", use -b option to extract");
                        if (tpos1 >= 0)
                            tagvalue.Remove(tpos1, 26);

                        ExifTagItem itm;
                        itm.name = tagname;
                        itm.value = tagvalue;
                        itm.group = taggroup;
                        this.Add(itm);
                    }

                    // is \r followed by \n ?
                    if (epos < output.Length)
                        epos += (output[epos + 1] == '\n') ? 2 : 1;
                    output = output.Substring(epos, output.Length - epos);
                }
            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }
        }

        public Boolean IsThumbnailExists(String strFolder, String filename, String thumbfile)
        {
            if (this.Count <= 0) return false;
            var q_items = from tagItem in this
                          where tagItem.name == "Thumbnail Image"
                          select tagItem;
            return q_items.Count() > 0;
            //{
            //    string toolPath = GetAppPath();
            //    toolPath += "/exiftool.exe ";
            //    string argStr = "";
            //    argStr += " -b -ThumbnailImage " + filename + " > " + thumbfile;

            //    string output = OpenExtract(toolPath, argStr, strFolder, filename, thumbfile);
            //    // Discard the outputs;
            //    if (output.Length > 0)
            //    {
            //        // Do nothing
            //    }

            //    return File.Exists(thumbfile);
            //}
            //return false;
        }

        public bool HasExifData()
        {
            return (this.Count > 0);
        }

        public ExifTagItem Find(string tagname)
        {
            var q_items = from tagItem in this
                          where tagItem.name == tagname
                          select tagItem;
            return q_items.First();
        }

        /// <summary>
        /// This method saves EXIF data to an external file (<file>.exif). Only tags with group EXIF are saved.
        /// </summary>
        /// <param name="source_image">Source Image file path</param>
        /// <param name="destination_exif_file">Destination .exif file path</param>
        /// <returns>True if no error</returns>
        public bool SaveExifData(string source_image, string destination_exif_file)
        {
            //// exiftool command
            //string toolPath = GetAppPath();
            //toolPath += "/exiftool.exe ";
            //toolPath += "-fast -m -q -q -tagsfromfile ";
            //toolPath += "\"" + source_image + "\" -exif ";
            //toolPath += "\"" + destination_exif_file + "\"";

            //string output = Open(toolPath);

            //if (output.Contains("Error"))
            //    return false;

            return true;
        }

        /// <summary>
        /// This method writes EXIF data to the given destination image file (must exist beforehand).
        /// </summary>
        /// <param name="source_exif_file">Source .exif file</param>
        /// <param name="destination_image">Destination image path (file must exist)</param>
        /// <returns></returns>
        public bool WriteExifData(string source_exif_file, string destination_image)
        {
            // exiftool command
            //string toolPath = GetAppPath();
            //toolPath += "/exiftool.exe ";
            //toolPath += "-fast -m -q -q -TagsFromFile ";
            //toolPath += "\"" + source_exif_file + "\"";
            //toolPath += " -all:all ";
            //toolPath += "\"" + destination_image + "\"";

            //string output = Open(toolPath);

            //if (output.Contains("Error"))
            //    return false;

            return true;
        }
        #endregion

        #region Private methods
        /// <summary>
        /// Gets the path from where the executable is being run
        /// </summary>
        /// <returns>Path</returns> 
        private string GetAppPath()
        {
            string AppPath = Directory.GetCurrentDirectory();
            //AppPath = Assembly.GetExecutingAssembly().Location;
            //AppPath = Path.GetDirectoryName(AppPath);

            return AppPath;
        }

        private string stdOut = null;
        private string stdErr = null;
        private ProcessStartInfo psi = null;
        private Process activeProcess = null;

        private void Thread_ReadStandardError()
        {
            if (activeProcess != null)
            {
                stdErr = activeProcess.StandardError.ReadToEnd();
            }
        }

        private void Thread_ReadStandardOut()
        {
            if (activeProcess != null)
            {
                stdOut = activeProcess.StandardOutput.ReadToEnd();
            }
        }

        private string Open(string app, string cmd)
        {
            //string program = "\"%COMSPEC%\"";
            string args = "/C [command]";
            this.psi = new ProcessStartInfo(
                //Environment.ExpandEnvironmentVariables(program),
                app,
                args.Replace("[command]", cmd)
            );
            this.psi.CreateNoWindow = true;
            this.psi.UseShellExecute = false;
            this.psi.RedirectStandardOutput = true;
            this.psi.RedirectStandardError = true;

            Thread thread_ReadStandardError = new Thread(new ThreadStart(Thread_ReadStandardError));
            Thread thread_ReadStandardOut = new Thread(new ThreadStart(Thread_ReadStandardOut));

            activeProcess = Process.Start(psi);
            if (psi.RedirectStandardError)
            {
                thread_ReadStandardError.Start();
            }
            if (psi.RedirectStandardOutput)
            {
                thread_ReadStandardOut.Start();
            }
            activeProcess.WaitForExit();

            thread_ReadStandardError.Join();
            thread_ReadStandardOut.Join();

            if (!String.IsNullOrEmpty(stdErr))
            {
                System.Diagnostics.Debug.WriteLine(stdErr);
            }

            string output = stdOut + stdErr;

            return output;
        }
        private string OpenExtract(string app, string cmd, String strFolder, String strfile, String strThumbfile)
        {
            //string program = "\"%COMSPEC%\"";
            String strDir = Directory.GetCurrentDirectory();
            Directory.SetCurrentDirectory(strFolder);

            try
            {
                string args = "[command]";
                this.psi = new ProcessStartInfo(
                    //Environment.ExpandEnvironmentVariables(program),
                    app,
                    args.Replace("[command]", cmd)
                );
                this.psi.CreateNoWindow = true;
                this.psi.UseShellExecute = false;
                this.psi.RedirectStandardOutput = false;
                this.psi.RedirectStandardError = true;

                //Thread thread_ReadStandardOut = new Thread(new ThreadStart(Thread_ReadStandardOut));
                Thread thread_ReadStandardError = new Thread(new ThreadStart(Thread_ReadStandardError));

                activeProcess = Process.Start(psi);
                //if (psi.RedirectStandardOutput)
                //{
                //    thread_ReadStandardOut.Start();
                //}
                if (psi.RedirectStandardError)
                {
                    thread_ReadStandardError.Start();
                }
                activeProcess.WaitForExit();
                //thread_ReadStandardOut.Join();
                thread_ReadStandardError.Join();

                if (!String.IsNullOrEmpty(stdErr))
                {
                    System.Diagnostics.Debug.WriteLine(stdErr);
                }

                // Write the file           
                //byte[] bytes = new byte[stdOut.Length * sizeof(char)];
                //System.Buffer.BlockCopy(stdOut.ToCharArray(), 0, bytes, 0, bytes.Length);
                //File.WriteAllBytes(strfile, bytes);

                Directory.SetCurrentDirectory(strDir);

            }
            catch (Exception exp)
            {
                System.Diagnostics.Debug.WriteLine(exp.Message);
            }

            string output = "";

            return output;
        }
        #endregion
    }
}
